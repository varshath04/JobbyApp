import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsApiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getCamelCaseData = data => {
    const jobDetails = data.job_details
    const updatedJobDetails = {
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      jobDescription: jobDetails.job_description,
      location: jobDetails.location,
      rating: jobDetails.rating,
      title: jobDetails.title,
      packagePerAnnum: jobDetails.package_per_annum,
      skills: jobDetails.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      })),
      lifeAtCompany: {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      },
    }

    const similarJobs = data.similar_jobs.map(eachJob => ({
      companyLogoUrl: eachJob.company_logo_url,
      employmentType: eachJob.employment_type,
      id: eachJob.id,
      jobDescription: eachJob.job_description,
      location: eachJob.location,
      rating: eachJob.rating,
      title: eachJob.title,
    }))

    return {updatedJobDetails, similarJobs}
  }

  getJobItemDetails = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const {updatedJobDetails, similarJobs} = this.getCamelCaseData(data)
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderApiFailure = () => (
    <div className="jobs-api-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-api-failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
      companyWebsiteUrl,
      skills = [],
      lifeAtCompany = {},
    } = jobDetails

    return (
      <div className="job-details-content-container">
        <div className="job-details-card">
          <div className="logo-title-container-card">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-card"
            />
            <div className="title-rating-container-card">
              <h1 className="job-title-card">{title}</h1>
              <div className="rating-container-card">
                <AiFillStar className="star-icon" />
                <p className="rating-card">{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-employment-package">
            <div className="location-employment-container">
              <div className="loc">
                <IoLocationSharp className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <div className="emp">
                <BsFillBriefcaseFill className="briefcase-icon" />
                <p className="employment">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr className="separator" />

          <div className="desc-visit-container">
            <h1 className="desc-heading">Description</h1>
            {companyWebsiteUrl && (
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="visit-link"
              >
                Visit <FiExternalLink />
              </a>
            )}
          </div>
          <p className="description">{jobDescription}</p>

          {skills.length > 0 && (
            <>
              <h1 className="section-heading">Skills</h1>
              <ul className="skills-list">
                {skills.map(each => (
                  <li key={each.name} className="skill-item">
                    <img
                      src={each.imageUrl}
                      alt={each.name}
                      className="skill-icon"
                    />
                    <p className="skill-name">{each.name}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {lifeAtCompany.description && (
            <>
              <h1 className="section-heading">Life at Company</h1>
              <div className="life-at-company">
                <p className="life-desc">{lifeAtCompany.description}</p>
                {lifeAtCompany.imageUrl && (
                  <img
                    src={lifeAtCompany.imageUrl}
                    alt="life at company"
                    className="life-image"
                  />
                )}
              </div>
            </>
          )}
        </div>

        {similarJobs.length > 0 && (
          <>
            <h1 className="similar-heading">Similar Jobs</h1>
            <ul className="similar-jobs-list">
              {similarJobs.map(each => (
                <SimilarJobCard key={each.id} jobDetails={each} />
              ))}
            </ul>
          </>
        )}
      </div>
    )
  }

  renderJobDetailsPage = () => {
    const {jobDetailsApiStatus} = this.state
    switch (jobDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderApiFailure()
      case apiStatusConstants.success:
        return this.renderJobDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-page">
        <Header />
        {this.renderJobDetailsPage()}
      </div>
    )
  }
}

export default JobItemDetails
