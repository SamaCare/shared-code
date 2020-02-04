const _ = require('lodash');
const moment = require('moment');

const DATE_FORMAT = 'MM/DD/YYYY';
const CUSTOM_FIELDS = {
  SAMA_FAX: {
    key: 'SAMA_FAX',
    title: 'Sama fax',
    value: '505-209-2637',
  },
  TODAY: {
    key: 'TODAY',
    title: 'Date (today)',
    // PST is reasonable since since all users are in the US, and work 9 - 5
    // In the continental US, we will experience issues with auths submitted between 12am - 3am
    // In Hawaii, we will experience issues with auths submitted between 10pm - 11:59pm
    // Also, purposefully not using an arrow function here to support IE11
    value() { return moment().utcOffset('-0800').format(DATE_FORMAT); },
  },
  NUM_PAGES_IN_TRANSMISSION: {
    key: 'NUM_PAGES_IN_TRANSMISSION',
    title: 'Number of pages in transmission',
    value: 'N/A',
  },
};
const ICDRegex = /([A-TV-Z][0-9][A-Z0-9](\.?[A-Z0-9]{0,4})?)/;

const getValue = (config, id, samaTypes) => {
  // first check for custom fields
  const customField = _.find(CUSTOM_FIELDS, custom => (_.includes(samaTypes, custom.key)));
  if (_.isNil(_.get(config, _.get(customField, 'key'))) && _.get(customField, 'value')) {
    // if the custom field is not overridden by the config and it has a value then use it
    return _.isFunction(customField.value) ? customField.value() : customField.value;
  }
  // next check for authorization specific value
  const value = _.get(config, id, (customField ? config[_.get(customField, 'key')] : null));
  if (!_.isNil(value)) {
    return value;
  }
  // otherwise fallback to samaTypes
  if (!_.isEmpty(samaTypes)) {
    return _.trim(_.compact(_.map(samaTypes, samaType => config[samaType])).join(' '));
  }

  return null;
};

module.exports = {
  CUSTOM_FIELDS,
  DATE_FORMAT,
  ICDRegex,
  getValue,
};
