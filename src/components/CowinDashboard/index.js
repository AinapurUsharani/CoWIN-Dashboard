import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    covidVaccinationList: [],
    app: 'INITIAL',
    VaccinationListBasedGender: [],
    ListBasedOnAge: [],
  }

  componentDidMount() {
    this.renderDetails()
  }

  renderDetails = async () => {
    this.setState({
      app: apiStatus.inProgress,
    })
    const url = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(url)

    if (response.ok === true) {
      const Data = await response.json()
      const updatedData = Data.last_7_days_vaccination.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      const DataByGender = Data.vaccination_by_gender.map(each => ({
        count: each.count,
        gender: each.gender,
      }))
      const DataByAge = Data.vaccination_by_age.map(each => ({
        age: each.age,
        count: each.count,
      }))
      this.setState({
        covidVaccinationList: updatedData,
        app: apiStatus.success,
        VaccinationListBasedGender: DataByGender,
        ListBasedOnAge: DataByAge,
      })
    } else {
      this.setState({app: apiStatus.failure})
    }
  }

  renderSuccessApp = () => {
    const {
      covidVaccinationList,
      VaccinationListBasedGender,
      ListBasedOnAge,
    } = this.state

    return (
      <>
        <VaccinationCoverage Details={covidVaccinationList} />
        <VaccinationByGender Details={VaccinationListBasedGender} />
        <VaccinationByAge Details={ListBasedOnAge} />
      </>
    )
  }

  renderFailureApp = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderProgressApp = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderApp = () => {
    const {app} = this.state

    switch (app) {
      case apiStatus.success:
        return this.renderSuccessApp()
      case apiStatus.failure:
        return this.renderFailureApp()
      case apiStatus.inProgress:
        return this.renderProgressApp()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="responsive">
          <div className="nav-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo-image"
            />
            <h1 className="heading">Co-WIN</h1>
          </div>
          <h1 className="pre-heading">CoWIN Vaccination in India</h1>
          {this.renderApp()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
