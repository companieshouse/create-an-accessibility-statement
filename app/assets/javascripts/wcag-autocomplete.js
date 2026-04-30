
document.addEventListener('DOMContentLoaded', function () {
  var select = document.querySelector('.js-wcag-autocomplete')

  if (!select) {
    return
  }

  accessibleAutocomplete.enhanceSelectElement({
    selectElement: select,
    showAllValues: true,
    defaultValue: '',
    autoselect: false,
    confirmOnBlur: false
  })
})
