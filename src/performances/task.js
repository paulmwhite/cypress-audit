const lighthouseLib = require("lighthouse");
const fs = require("fs");

const compare = (thresholds) => (newValue) => {
  const errors = [];
  const results = [];

  Object.keys(thresholds).forEach((key) => {
    if (thresholds[key] > newValue[key]) {
      errors.push(
        `${key}: ${newValue[key]} is under ${thresholds[key]} threshold`
      );
    } else {
      results.push(
        `${key}: ${newValue[key]} is >= ${thresholds[key]} threshold`
      );
    }
  });

  return { errors, results };
};

const lighthouse = ({ url, thresholds, opts = {}, config }) => {
  if (port) {
    opts.port = port;

    return lighthouseLib(url, { disableStorageReset: true, ...opts }, config)
      .then((results) =>
        Object.keys(results.lhr.categories).reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: results.lhr.categories[curr].score * 100,
          }),
          generateReport(opts.outputDir, results.report)
        )
      )
      .then(compare(thresholds));
  }

  return null;
};

const generateReport = (outputDir, report) => {
  if (outputDir) {
    fs.writeFileSync(outputDir, report);
  }
};

module.exports = { lighthouse };
