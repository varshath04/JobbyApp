import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const FiltersGroup = props => {
  const {updateEmploymentTypesChecked, updateActiveSalaryRangeId} = props // spelling corrected

  const renderEmploymentTypesList = () =>
    employmentTypesList.map(eachType => {
      const onUpdateType = () =>
        updateEmploymentTypesChecked(eachType.employmentTypeId)

      return (
        <li className="filters-list-item" key={eachType.employmentTypeId}>
          <input
            type="checkbox"
            className="checkbox-input"
            id={eachType.employmentTypeId}
            onChange={onUpdateType}
          />
          <label htmlFor={eachType.employmentTypeId} className="filter-label">
            {eachType.label}
          </label>
        </li>
      )
    })

  const renderSalaryRangesList = () =>
    salaryRangesList.map(eachRange => {
      const onUpdateSalary = () =>
        updateActiveSalaryRangeId(eachRange.salaryRangeId)

      return (
        <li className="filters-list-item" key={eachRange.salaryRangeId}>
          <input
            type="radio"
            className="salary-radio-input"
            id={eachRange.salaryRangeId}
            name="salary"
            onChange={onUpdateSalary}
          />
          <label htmlFor={eachRange.salaryRangeId} className="filter-label">
            {eachRange.label}
          </label>
        </li>
      )
    })

  return (
    <div className="filters-group-container">
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="filters-list">{renderEmploymentTypesList()}</ul>

      <h1 className="filter-heading">Salary Range</h1>
      <ul className="filters-list">{renderSalaryRangesList()}</ul>
    </div>
  )
}

export default FiltersGroup
