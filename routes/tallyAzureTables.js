var azure = require("azure-storage");
var fileNames = require("./fileNames.js");

var tallyStorage= {partitionKey:"tally",
                   table: "tally"};

function getAzureTableService() {
  return azure.createTableService(process.env.AzureTableAccount, process.env.AzureTableAccessKey);
}

exports.getTally = function(id, callback) {
  var tableSvc = getAzureTableService();
  
  console.log("retreiveing ", id);
  tableSvc.retrieveEntity(tallyStorage.table, tallyStorage.partitionKey, id, function(downloadErr, tableResponse) {
    //console.log("err ", downloadErr);
    //console.log("retrieved " + JSON.stringify(tableResponse));
    var tally = convertObjectForAzure(tableResponse);
    //console.log("got tally back from conversion " + JSON.stringify(tally));
    callback(tally);
  });
}

exports.deleteTally = function(id, callback) {
  var entGen = azure.TableUtilities.entityGenerator;
  var azureTally = {
    PartitionKey: entGen.String("tally"),
    RowKey: entGen.String(id)
  };

  var tableSvc = getAzureTableService();
  tableSvc.deleteEntity("tally", azureTally, function(deleteErr, response) {
    callback();
  });
}

exports.saveTally = function(tally, callback) {
  var tableSvc = getAzureTableService();

  tableSvc.createTableIfNotExists("tally", function(error, result, response) {
    if (!error) {
      var azureTally = applyAzureProperties(tally);

      console.log("saving " + JSON.stringify(azureTally));
      tableSvc.insertEntity("tally", azureTally, function(error, result, response) {
        if (error) {
          console.log("*Error saving tally " + error.toString());
        }
        else {
          callback(tally.id);
        }
      });
    }
  });
}

exports.queryTallies = function(searchParamKvp, callback) {
  var tableSvc = getAzureTableService();
  var query = new azure.TableQuery()
    .from("tally");

  for (var i = 0; i <= searchParamKvp.length; i++) {
    query = query.where(searchParamKvp.property + " eq " + searchParamKvp.value);
  }

  tableSvc.queryEntities("tally", query, null, function(error, result, response) {
    if (!error) {
      callback(result);
    }
  });
}

exports.getAllTallies = function(callback) {
  var tableSvc = getAzureTableService();
  var query = new azure.TableQuery().where('PartitionKey eq ?', 'tally');

  tableSvc.queryEntities("tally", query, null, function(error, result, response) {
    if (!error) {
      var tallyCount = result.entries.length;
      console.log("got tally count ", tallyCount);
      var tallies = [];
      result.entries.forEach(function(azureTally) {
        tallies.push(convertObjectForAzure(azureTally));
      });
      callback(tallies);
    }
  });
}


function convertObjectForAzure(azureTableEntity) {
  var obj = {};
  for (var propertyName in azureTableEntity) {
    if (["PartitionKey", "RowKey"].indexOf(propertyName) == -1) {
      obj[propertyName] = azureTableEntity[propertyName]["_"];
    }
  }
  return obj;
}

function applyAzureProperties(obj) {
  var entGen = azure.TableUtilities.entityGenerator;
  var azureObj = {
    PartitionKey: entGen.String("tally"),
    RowKey: entGen.String(obj.id)
  };
  //iterate all properties on the object, and
  //create on the Azure entity, with its value as String type.
  for (var propertyName in obj) {
    azureObj[propertyName] = entGen.String(obj[propertyName]);
  }
  return azureObj;
}

