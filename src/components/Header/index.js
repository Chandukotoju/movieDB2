import Loader from 'react-loader-spinner'
import {Component} from 'react'
import {Link} from 'react-router-dom'
// import {IoIosSearch, IoMdClose, IoMdMenu} from 'react-icons/io'
// import {MdHome, MdSchedule} from 'react-icons/md'
// import {RxArrowTopRight} from 'react-icons/rx'
import MovieCard from '../MovieCard'
// import './index.css'

// <div className="search-div">
//   <input
//     className="search-input"
//     onChange={onChangeInput}
//     type="search"
//     placeholder="Search"
//   />
//   <IoIosSearch className="search-icon" />
// </div>
// {data.length >= 1 ? renderDiffrentViews() : ''}
// ;<div className="lg-hide">
//   {!isShowMenu ? (
//     <button type="button" className="menu-btn" onClick={this.toggleMenuBtn}>
//       <IoMdMenu className="icon" />
//     </button>
//   ) : (
//     <button type="button" className="menu-btn" onClick={this.toggleMenuBtn}>
//       <IoMdClose className="icon" />
//     </button>
//   )}
// </div>
// {
// isShowMenu ? (
//   <div className="menu-div">
//     <div className="nav-items-sm">
//       <Link to="/" className="route-link">
//         <MdHome className="route-icon" />
//         <p className="item"> Home</p>
//       </Link>
//       <Link to="/top-rated" className="route-link">
//         <RxArrowTopRight className="route-icon" />
//         <p className="item">Top Rated Movies</p>
//       </Link>
//       <Link to="/upcoming" className="route-link">
//         <MdSchedule className="route-icon" />
//         <p className="item">Upcoming Movies</p>
//       </Link>
//     </div>
//   </div>
// ) : null
// }

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Header extends Component {
  state = {
    isShowMenu: false,
    searchInput: '',
    data: [],
    status: apiStatusConstants.inProgress,
  }

  toggleMenuBtn = () => {
    this.setState(prevState => ({isShowMenu: !prevState.isShowMenu}))
  }

  onChangeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  searchResults = async () => {
    const {searchInput} = this.state
    const API_KEY = '76a3b00b83c8438422c7b7eb425b0645'
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchInput}&page=1`,
      )
      const dataResponse = await response.json()
      const updatedData = dataResponse.results.map(each => ({
        adult: each.adult,
        backdropPath: each.backdrop_path,
        genreIds: each.genre_ids,
        id: each.id,
        originalLanguage: each.original_language,
        originalTitle: each.original_title,
        overview: each.overview,
        popularity: each.popularity,
        posterPath: each.poster_path,
        releaseDate: each.release_date,
        title: each.title,
        video: each.video,
        voteAverage: each.vote_average,
        voteCount: each.vote_count,
      }))
      this.setState({
        status: apiStatusConstants.success,
        data: updatedData,
      })
    } catch (error) {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  searchData = () => {
    this.searchResults()
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {data} = this.state
    return (
      <div className="search-movies-container movies-container">
        <h1 className="heading">Search Result</h1>
        <ul className="movies-list-container">
          {data.map(each => (
            <MovieCard
              isSearchResult
              key={`details${each.id}`}
              movieDetails={each}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderDiffrentViews = () => {
    const {status} = this.state
    switch (status) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return <h1 className="failure-mesg">Error</h1>
      default:
        return null
    }
  }

  render() {
    const {data, searchInput} = this.state
    return (
      <>
        <nav className="nav-bar">
          <h1>
            Prime <span className="logo-high">Show</span>
          </h1>

          <input
            value={searchInput}
            onChange={this.onChangeInput}
            type="search"
            id="search"
            name="search"
            placeholder="Search"
          />
          <button onClick={this.searchData} type="button">
            Search
          </button>

          <div className="itemss">
            <Link to="/">
              <h1>movieDB</h1>
            </Link>
            <Link to="/top-rated" className="link">
              <p>Top Rated</p>
            </Link>
            <Link to="/upcoming">
              <p>Upcoming</p>
            </Link>
            <Link to="/">
              <p>Popular</p>
            </Link>
          </div>
        </nav>
        {data.length >= 1 ? this.renderDiffrentViews() : ''}
      </>
    )
  }
}
export default Header
