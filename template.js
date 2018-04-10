var json2csv = require('json2csv');
 
exports.get = function(req, res) {
 
    var fields = [
        'historicName',
        'city',
        'county',
        'state',
        'address',
        'secondaryCode',
        'ref'
    ];
 
    var csv = json2csv({ data: '', fields: fields });
 
    res.set("Content-Disposition", "attachment;filename=places.csv");
    res.set("Content-Type", "application/octet-stream");
 
    res.send(csv);
 
};