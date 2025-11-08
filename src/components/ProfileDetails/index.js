import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const ProfileDetails = props => {
  const {profileApiStatus, profileDetails, getProfileDetails} = props

  const renderProfile = () => {
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-details-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  const renderProfileFailure = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-button"
        onClick={getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  const renderProfileLoading = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  switch (profileApiStatus) {
    case apiStatusConstants.success:
      return renderProfile()
    case apiStatusConstants.failure:
      return renderProfileFailure()
    case apiStatusConstants.inProgress:
      return renderProfileLoading()
    default:
      return null
  }
}

export default ProfileDetails
