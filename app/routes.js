//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const wcagCriteriaItems = [
  { value: "", text: "Select a WCAG success criterion" },
  { value: "1.1.1", text: "1.1.1 (Non-text content)" },
  { value: "1.2.1", text: "1.2.1 (Audio-only and video-only - prerecorded)" },
  { value: "1.2.2", text: "1.2.2 (Captions - prerecorded)" },
  { value: "1.2.3", text: "1.2.3 (Audio description or media alternative)" },
  { value: "1.2.4", text: "1.2.4 (Captions - live)" },
  { value: "1.2.5", text: "1.2.5 (Audio description - prerecorded)" },
  { value: "1.3.1", text: "1.3.1 (Info and relationships)" },
  { value: "1.3.2", text: "1.3.2 (Meaningful sequence)" },
  { value: "1.3.3", text: "1.3.3 (Sensory characteristics)" },
  { value: "1.3.4", text: "1.3.4 (Orientation)" },
  { value: "1.3.5", text: "1.3.5 (Identify input purpose)" },
  { value: "1.4.1", text: "1.4.1 (Use of colour)" },
  { value: "1.4.2", text: "1.4.2 (Audio control)" },
  { value: "1.4.3", text: "1.4.3 (Contrast - minimum)" },
  { value: "1.4.4", text: "1.4.4 (Resize text)" },
  { value: "1.4.5", text: "1.4.5 (Images of text)" },
  { value: "1.4.10", text: "1.4.10 (Reflow)" },
  { value: "1.4.11", text: "1.4.11 (Non-text contrast)" },
  { value: "1.4.12", text: "1.4.12 (Text spacing)" },
  { value: "1.4.13", text: "1.4.13 (Content on hover or focus)" },
  { value: "2.1.1", text: "2.1.1 (Keyboard)" },
  { value: "2.1.2", text: "2.1.2 (No keyboard trap)" },
  { value: "2.1.4", text: "2.1.4 (Character key shortcuts)" },
  { value: "2.2.1", text: "2.2.1 (Timing adjustable)" },
  { value: "2.2.2", text: "2.2.2 (Pause, stop, hide)" },
  { value: "2.3.1", text: "2.3.1 (Three flashes or below threshold)" },
  { value: "2.4.1", text: "2.4.1 (Bypass blocks)" },
  { value: "2.4.2", text: "2.4.2 (Page titled)" },
  { value: "2.4.3", text: "2.4.3 (Focus order)" },
  { value: "2.4.4", text: "2.4.4 (Link purpose - in context)" },
  { value: "2.4.5", text: "2.4.5 (Multiple ways)" },
  { value: "2.4.6", text: "2.4.6 (Headings and labels)" },
  { value: "2.4.7", text: "2.4.7 (Focus visible)" },
  { value: "2.4.11", text: "2.4.11 (Focus not obscured - minimum)" },
  { value: "2.5.1", text: "2.5.1 (Pointer gestures)" },
  { value: "2.5.2", text: "2.5.2 (Pointer cancellation)" },
  { value: "2.5.3", text: "2.5.3 (Label in name)" },
  { value: "2.5.4", text: "2.5.4 (Motion actuation)" },
  { value: "2.5.7", text: "2.5.7 (Dragging movements)" },
  { value: "2.5.8", text: "2.5.8 (Target size - minimum)" },
  { value: "3.1.1", text: "3.1.1 (Language of page)" },
  { value: "3.1.2", text: "3.1.2 (Language of parts)" },
  { value: "3.2.1", text: "3.2.1 (On focus)" },
  { value: "3.2.2", text: "3.2.2 (On input)" },
  { value: "3.2.3", text: "3.2.3 (Consistent navigation)" },
  { value: "3.2.4", text: "3.2.4 (Consistent identification)" },
  { value: "3.2.6", text: "3.2.6 (Consistent help)" },
  { value: "3.3.1", text: "3.3.1 (Error identification)" },
  { value: "3.3.2", text: "3.3.2 (Labels or instructions)" },
  { value: "3.3.3", text: "3.3.3 (Error suggestion)" },
  { value: "3.3.4", text: "3.3.4 (Error prevention - legal, financial, data)" },
  { value: "3.3.7", text: "3.3.7 (Redundant entry)" },
  { value: "3.3.8", text: "3.3.8 (Accessible authentication)" },
  { value: "4.1.1", text: "4.1.1 (Parsing)" },
  { value: "4.1.2", text: "4.1.2 (Name, role, value)" },
  { value: "4.1.3", text: "4.1.3 (Status messages)" }
]

function getNextNonComplianceRoute (data) {
  const reasons = data.nonComplianceReasons || []
  const done = data.nonComplianceDone || {}

  if (reasons.includes('wcag') && !done.wcag) return '/failed-criteria'
  if (reasons.includes('out-of-scope') && !done.outOfScope) return '/out-of-scope'
  if (reasons.includes('disproportionate-burden') && !done.disproportionateBurden) return '/disproportionate-burden'

  return '/publish-date'
}

// --------------------------------------------------
// START PAGE
// --------------------------------------------------

router.get('/', function (req, res) {
  res.render('index')
})

// ✅ Missing GET route
router.get('/service-name', function (req, res) {
  res.render('service-name')
})

// --------------------------------------------------
// NON-COMPLIANCE REASONS
// --------------------------------------------------

router.get('/non-compliance-reasons', function (req, res) {
  res.render('non-compliance-reasons')
})

router.post('/non-compliance-reasons', function (req, res) {
  const errorSummary = []
  const fieldErrors = {}

  const raw = req.body.nonComplianceReasons

  const selected = Array.isArray(raw)
    ? raw.filter(v => v && v !== '_unchecked' && v !== '__unchecked__')
    : (raw && raw !== '_unchecked' && raw !== '__unchecked__') ? [raw] : []

  req.session.data.nonComplianceReasons = selected

  if (selected.length === 0) {
    errorSummary.push({ text: 'Select why the service did not meet accessibility requirements', href: '#nonComplianceReasons' })
    fieldErrors.nonComplianceReasons = { text: 'Select why the service did not meet accessibility requirements' }

    return res.render('non-compliance-reasons', { errorSummary, fieldErrors })
  }

  // If exemptions were selected, show warning first
  if (selected.includes('out-of-scope') || selected.includes('disproportionate-burden')) {
    return res.redirect('/non-compliance-warning')
  }

  // WCAG only
  return res.redirect('/failed-criteria')
})

// --------------------------------------------------
// SERVICE NAME (POST)
// --------------------------------------------------

router.post('/service-name', function (req, res) {
  const serviceName = req.body.serviceName

  if (!serviceName || serviceName.trim() === '') {
    return res.render('service-name', {
      errorSummary: [{ text: 'Enter the name of the service', href: '#service-name' }],
      fieldErrors: { serviceName: { text: 'Enter the name of the service' } }
    })
  }

  req.session.data.serviceName = serviceName
  res.redirect('/existing-statement')
})

// --------------------------------------------------
// EXISTING STATEMENT
// --------------------------------------------------

router.get('/existing-statement', function (req, res) {
  res.render('existing-statement')
})

router.post('/existing-statement', function (req, res) {
  const errorSummary = []
  const fieldErrors = {}

  const hasExisting = req.body.hasExistingStatement

  const firstDay = req.body['firstPublishedDate-day']
  const firstMonth = req.body['firstPublishedDate-month']
  const firstYear = req.body['firstPublishedDate-year']

  const firstDayNum = Number(firstDay)
  const firstMonthNum = Number(firstMonth)
  const firstYearNum = Number(firstYear)
  const currentYear = new Date().getFullYear()

  if (!hasExisting) {
    errorSummary.push({ text: 'Select yes if the service already has an accessibility statement', href: '#existing-statement' })
    fieldErrors.hasExistingStatement = { text: 'Select yes if the service already has an accessibility statement' }
  }

  if (hasExisting === 'yes') {
    if (!firstDay || !firstMonth || !firstYear) {
      errorSummary.push({ text: 'Enter the date the statement was first published', href: '#firstPublishedDate-day' })
      fieldErrors.firstPublishedDate = { text: 'Enter the date the statement was first published' }
    } else {
      if (firstMonthNum < 1 || firstMonthNum > 12) {
        errorSummary.push({ text: 'First published month must be between 1 and 12', href: '#firstPublishedDate-month' })
        fieldErrors.firstPublishedDate = { text: 'First published month must be between 1 and 12' }
      }
      if (firstDayNum < 1 || firstDayNum > 31) {
        errorSummary.push({ text: 'First published day must be between 1 and 31', href: '#firstPublishedDate-day' })
        fieldErrors.firstPublishedDate = { text: 'First published day must be between 1 and 31' }
      }
      if (firstYearNum > currentYear) {
        errorSummary.push({ text: 'First published year must not be in the future', href: '#firstPublishedDate-year' })
        fieldErrors.firstPublishedDate = { text: 'First published year must not be in the future' }
      }
    }
  }

  if (errorSummary.length) {
    req.session.data.hasExistingStatement = hasExisting
    req.session.data['firstPublishedDate-day'] = firstDay
    req.session.data['firstPublishedDate-month'] = firstMonth
    req.session.data['firstPublishedDate-year'] = firstYear

    return res.render('existing-statement', { errorSummary, fieldErrors })
  }

  req.session.data.hasExistingStatement = hasExisting

  if (hasExisting === 'yes') {
    req.session.data['firstPublishedDate-day'] = firstDay
    req.session.data['firstPublishedDate-month'] = firstMonth
    req.session.data['firstPublishedDate-year'] = firstYear
  } else {
    delete req.session.data['firstPublishedDate-day']
    delete req.session.data['firstPublishedDate-month']
    delete req.session.data['firstPublishedDate-year']
  }

  res.redirect('/auditor')
})

// --------------------------------------------------
// AUDITOR
// --------------------------------------------------

router.get('/auditor', function (req, res) {
  res.render('auditor')
})

router.post('/auditor', function (req, res) {
  const errorSummary = []
  const fieldErrors = {}

  const day = req.body['auditDate-day']
  const month = req.body['auditDate-month']
  const year = req.body['auditDate-year']
  const auditedBy = req.body.auditedBy
  const auditSummary = (req.body.auditSummary || '').trim()

  const dayNum = Number(day)
  const monthNum = Number(month)
  const yearNum = Number(year)
  const currentYear = new Date().getFullYear()

  // ---- Audit date validation ----
  if (!day || !month || !year) {
    errorSummary.push({
      text: 'Enter the date the service was audited',
      href: '#auditDate-day'
    })
    fieldErrors.auditDate = {
      text: 'Enter the date the service was audited'
    }
  } else {
    if (dayNum < 1 || dayNum > 31) {
      errorSummary.push({
        text: 'Day must be between 1 and 31',
        href: '#auditDate-day'
      })
      fieldErrors.auditDate = { text: 'Day must be between 1 and 31' }
    }

    if (monthNum < 1 || monthNum > 12) {
      errorSummary.push({
        text: 'Month must be between 1 and 12',
        href: '#auditDate-month'
      })
      fieldErrors.auditDate = { text: 'Month must be between 1 and 12' }
    }

    if (yearNum > currentYear) {
      errorSummary.push({
        text: 'Year must not be in the future',
        href: '#auditDate-year'
      })
      fieldErrors.auditDate = { text: 'Year must not be in the future' }
    }
  }

  // ---- Auditor validation ----
  if (!auditedBy) {
    errorSummary.push({
      text: 'Select who audited the service',
      href: '#audited-by'
    })
    fieldErrors.auditedBy = {
      text: 'Select who audited the service'
    }
  }

  // ---- NEW: audit summary validation ----
  if (!auditSummary) {
    errorSummary.push({
      text: 'Enter a summary of what was tested as part of the audit',
      href: '#audit-summary'
    })
    fieldErrors.auditSummary = {
      text: 'Enter a summary of what was tested as part of the audit'
    }
  }

  if (errorSummary.length) {
    return res.render('auditor', {
      errorSummary,
      fieldErrors
    })
  }

  // ---- Persist data ----
  req.session.data['auditDate-day'] = day
  req.session.data['auditDate-month'] = month
  req.session.data['auditDate-year'] = year
  req.session.data.auditedBy = auditedBy
  req.session.data.auditSummary = auditSummary

  res.redirect('/audit-result')
})

// --------------------------------------------------
// AUDIT RESULT
// --------------------------------------------------

router.get('/audit-result', function (req, res) {
  res.render('audit-result')
})

router.post('/audit-result', function (req, res) {
  const errorSummary = []
  const fieldErrors = {}

  const auditResult = req.body.auditResult

  if (!auditResult) {
    errorSummary.push({ text: 'Select the audit result', href: '#audit-result' })
    fieldErrors.auditResult = { text: 'Select the audit result' }
    return res.render('audit-result', { errorSummary, fieldErrors })
  }

  // Store both (useful later)
  req.session.data.auditResult = auditResult
  req.session.data.complianceStatus = auditResult

  // ✅ If pass, skip issues & non-compliance reasons and go straight to publish date
  if (auditResult === 'pass') {
    // Optional: clear any stale non-compliance data from earlier runs
    delete req.session.data.plainEnglishIssues
    delete req.session.data.nonComplianceReasons
    delete req.session.data.nonComplianceDone
    delete req.session.data.failedCriteria
    delete req.session.data.outOfScopeDetails
    delete req.session.data.disproportionateBurdenDetails
    delete req.session.data.approvalsConfirmed

    return res.redirect('/publish-date')
  }

  // ✅ partial/fail go to issues summary first
  return res.redirect('/issues-summary')
})

// --------------------------------------------------
// ISSUES SUMMARY
// --------------------------------------------------

router.get('/issues-summary', function (req, res) {
  res.render('issues-summary')
})

router.post('/issues-summary', function (req, res) {
  const errorSummary = []
  const fieldErrors = {}

  const text = (req.body.plainEnglishIssues || '').trim()

  if (!text) {
    errorSummary.push({ text: 'Enter a summary of the accessibility issues', href: '#issues-summary' })
    fieldErrors.plainEnglishIssues = { text: 'Enter a summary of the accessibility issues' }
    return res.render('issues-summary', { errorSummary, fieldErrors })
  }

  req.session.data.plainEnglishIssues = text

  // ✅ IMPORTANT: user has not chosen non-compliance reasons yet
  return res.redirect('/non-compliance-reasons')
})

// --------------------------------------------------
// NON-COMPLIANCE WARNING
// --------------------------------------------------

router.get('/non-compliance-warning', function (req, res) {
  res.render('non-compliance-warning')
})

router.post('/non-compliance-warning', function (req, res) {
  const errorSummary = []
  const fieldErrors = {}

  const raw = req.body.approvalsConfirmed
  const selected = (Array.isArray(raw) ? raw : raw ? [raw] : [])
    .map(v => (typeof v === 'string' ? v.trim() : v))
    .filter(v => v && v !== '_unchecked' && v !== '__unchecked__' && v !== '0')

  const hasConfirmed = selected.includes('confirmed')

  if (!hasConfirmed) {
    errorSummary.push({
      text: 'Confirm you have the evidence and approvals needed',
      href: '#approvalsConfirmed'
    })
    fieldErrors.approvalsConfirmed = { text: 'Confirm you have the evidence and approvals needed' }
    return res.render('non-compliance-warning', { errorSummary, fieldErrors })
  }

  req.session.data.approvalsConfirmed = true
  req.session.data.nonComplianceDone = req.session.data.nonComplianceDone || {}

  return res.redirect(getNextNonComplianceRoute(req.session.data))
})

// --------------------------------------------------
// FAILED CRITERIA
// --------------------------------------------------

router.get('/failed-criteria', function (req, res) {
  req.session.data.failedCriteria = req.session.data.failedCriteria || []
  res.render('failed-criteria', { wcagCriteriaItems })
})

router.post('/failed-criteria', function (req, res) {
  req.session.data.failedCriteria = req.session.data.failedCriteria || []

  const errorSummary = []
  const fieldErrors = {}

  const issueDescription = (req.body.issueDescription || '').trim()
  const wcagCriterion = (req.body.wcagCriterion || '').trim()

  if (!issueDescription) {
    errorSummary.push({ text: 'Enter a description of the accessibility issue', href: '#issue-description' })
    fieldErrors.issueDescription = { text: 'Enter a description of the accessibility issue' }
  }

  if (!wcagCriterion) {
    errorSummary.push({ text: 'Select a WCAG success criterion', href: '#wcagCriterion' })
    fieldErrors.wcagCriterion = { text: 'Select a WCAG success criterion' }
  }

  if (errorSummary.length) {
    req.session.data.issueDescription = issueDescription
    req.session.data.wcagCriterion = wcagCriterion
    return res.render('failed-criteria', { wcagCriteriaItems, errorSummary, fieldErrors })
  }

  const match = wcagCriteriaItems.find(i => i.value === wcagCriterion)
  const wcagText = match ? match.text : wcagCriterion

  req.session.data.failedCriteria.push({
    description: issueDescription,
    wcag: wcagCriterion,
    wcagText
  })

  delete req.session.data.issueDescription
  delete req.session.data.wcagCriterion

  return res.redirect('/failed-criteria/list')
})

router.get('/failed-criteria/list', function (req, res) {
  req.session.data.failedCriteria = req.session.data.failedCriteria || []
  res.render('failed-criteria-list')
})

router.get('/failed-criteria/continue', function (req, res) {
  req.session.data.nonComplianceDone = req.session.data.nonComplianceDone || {}
  req.session.data.nonComplianceDone.wcag = true

  const reasons = req.session.data.nonComplianceReasons || []
  const wcagSelected = reasons.includes('wcag')
  const issues = req.session.data.failedCriteria || []

  if (wcagSelected && issues.length === 0) {
    return res.redirect('/failed-criteria')
  }

  return res.redirect(getNextNonComplianceRoute(req.session.data))
})

router.get('/failed-criteria/remove/:index', function (req, res) {
  const list = req.session.data.failedCriteria || []
  const index = Number(req.params.index)

  if (Number.isInteger(index) && index >= 0 && index < list.length) {
    list.splice(index, 1)
    req.session.data.failedCriteria = list
  }

  return res.redirect('/failed-criteria/list')
})

// --------------------------------------------------
// OUT OF SCOPE
// --------------------------------------------------

router.get('/out-of-scope', function (req, res) {
  res.render('out-of-scope')
})

router.post('/out-of-scope', function (req, res) {
  const errorSummary = []
  const fieldErrors = {}

  const text = (req.body.outOfScopeDetails || '').trim()

  if (!text) {
    errorSummary.push({ text: 'Enter a description of the content that is out of scope', href: '#out-of-scope-details' })
    fieldErrors.outOfScopeDetails = { text: 'Enter a description of the content that is out of scope' }
    return res.render('out-of-scope', { errorSummary, fieldErrors })
  }

  req.session.data.outOfScopeDetails = text
  req.session.data.nonComplianceDone = req.session.data.nonComplianceDone || {}
  req.session.data.nonComplianceDone.outOfScope = true

  return res.redirect(getNextNonComplianceRoute(req.session.data))
})

// --------------------------------------------------
// DISPROPORTIONATE BURDEN
// --------------------------------------------------

router.get('/disproportionate-burden', function (req, res) {
  res.render('disproportionate-burden')
})

router.post('/disproportionate-burden', function (req, res) {
  const errorSummary = []
  const fieldErrors = {}

  const text = (req.body.disproportionateBurdenDetails || '').trim()

  if (!text) {
    errorSummary.push({ text: 'Enter a description of the disproportionate burden', href: '#disproportionate-burden-details' })
    fieldErrors.disproportionateBurdenDetails = { text: 'Enter a description of the disproportionate burden' }
    return res.render('disproportionate-burden', { errorSummary, fieldErrors })
  }

  req.session.data.disproportionateBurdenDetails = text
  req.session.data.nonComplianceDone = req.session.data.nonComplianceDone || {}
  req.session.data.nonComplianceDone.disproportionateBurden = true

  return res.redirect(getNextNonComplianceRoute(req.session.data))
})

// --------------------------------------------------
// PUBLISH DATE
// --------------------------------------------------

router.get('/publish-date', function (req, res) {
  res.render('publish-date')
})

router.post('/publish-date', function (req, res) {
  const errorSummary = []
  const fieldErrors = {}

  const day = req.body['publishDate-day']
  const month = req.body['publishDate-month']
  const year = req.body['publishDate-year']

  const dayNum = Number(day)
  const monthNum = Number(month)

  if (!day || !month || !year) {
    errorSummary.push({ text: 'Enter the date the statement will be published', href: '#publishDate-day' })
    fieldErrors.publishDate = { text: 'Enter the date the statement will be published' }
  } else {
    if (monthNum < 1 || monthNum > 12) {
      errorSummary.push({ text: 'Month must be between 1 and 12', href: '#publishDate-month' })
      fieldErrors.publishDate = { text: 'Month must be between 1 and 12' }
    }
    if (dayNum < 1 || dayNum > 31) {
      errorSummary.push({ text: 'Day must be between 1 and 31', href: '#publishDate-day' })
      fieldErrors.publishDate = { text: 'Day must be between 1 and 31' }
    }
  }

  if (errorSummary.length) {
    req.session.data['publishDate-day'] = day
    req.session.data['publishDate-month'] = month
    req.session.data['publishDate-year'] = year
    return res.render('publish-date', { errorSummary, fieldErrors })
  }

  req.session.data['publishDate-day'] = day
  req.session.data['publishDate-month'] = month
  req.session.data['publishDate-year'] = year

  res.redirect('/statement')
})

// ✅ Missing GET route
router.get('/statement', function (req, res) {
  res.render('statement')
})

module.exports = router