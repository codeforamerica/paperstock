module.exports = function(req, res) {
  res.render('index', { 
      title: 'Open311 Status'
    , endpoints: endpointsData
    , serviceRequests: serviceRequestsData
  });
}