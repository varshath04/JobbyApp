import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,

    jobsList: [],
    jobsApiStatus: apiStatusConstants.initial,

    searchInput: '',
    activeSalaryRangeId: '',
    employmentTypesChecked: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  updateEmploymentTypesChecked = typeId => {
    this.setState(
      prevState => {
        const exists = prevState.employmentTypesChecked.includes(typeId)
        const employmentTypesChecked = exists
          ? prevState.employmentTypesChecked.filter(t => t !== typeId)
          : [...prevState.employmentTypesChecked, typeId]
        return {employmentTypesChecked}
      },
      () => this.getJobs(),
    )
  }

  updateSalaryRangeId = activeSalaryRangeId =>
    this.setState({activeSalaryRangeId}, () => this.getJobs())

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {
      activeSalaryRangeId,
      employmentTypesChecked,
      searchInput,
    } = this.state

    const employmentTypes = employmentTypesChecked.join(',')
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`

    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type, // from your sample
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  // ---------- API: Profile ----------
  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const pd = data.profile_details
      const updated = {
        name: pd.name,
        profileImageUrl: pd.profile_image_url,
        shortBio: pd.short_bio,
      }
      this.setState({
        profileDetails: updated,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearch = e => this.setState({searchInput: e.target.value})

  onSearch = () => this.getJobs()

  onSearchKeyDown = e => {
    if (e.key === 'Enter') this.getJobs()
  }

  renderSearchBar = searchBarId => {
    const {searchInput} = this.state
    return (
      <div className="search-bar" id={searchBarId}>
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={this.onChangeSearch}
          onKeyDown={this.onSearchKeyDown}
        />
        <button
          className="search-btn"
          type="button"
          data-testid="searchButton"
          onClick={this.onSearch}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderSideBar = () => {
    const {
      profileDetails,
      profileApiStatus,
      activeSalaryRangeId,
      employmentTypesChecked,
    } = this.state

    return (
      <aside className="side-bar">
        {this.renderSearchBar('smallSearchBar')}

        <ProfileDetails
          profileDetails={profileDetails}
          profileApiStatus={profileApiStatus}
          getProfileDetails={this.getProfileDetails}
        />

        <hr className="separator" />

        <FiltersGroup
          updateActiveSalaryRangeId={this.updateSalaryRangeId}
          activeSalaryRangeId={activeSalaryRangeId}
          updateEmploymentTypesChecked={this.updateEmploymentTypesChecked}
          employmentTypesChecked={employmentTypesChecked}
        />
      </aside>
    )
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    return jobsList.length > 0 ? (
      <ul className="jobs-list">
        {jobsList.map(eachJob => (
          <JobCard key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    ) : (
      this.renderNoJobsView()
    )
  }

  renderJobsLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobsApiFailureView = () => (
    <div className="jobs-api-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-api-failure-logo"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsBasedOnApiStatus = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobsLoaderView()
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderJobsApiFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-page-container">
        <Header />
        <div className="jobs-page">
          {this.renderSideBar()}
          <div className="jobs-container">
            {this.renderSearchBar('largeSearchBar')}
            {this.renderJobsBasedOnApiStatus()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
