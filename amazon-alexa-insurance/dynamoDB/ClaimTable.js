var AWS = require("aws-sdk");


AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAJJZLYEPMGLWOUSVQ";
AWS.config.secretAccessKey = "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";

AWS.config.update({
	region: "us-east-1",
	endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});


var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Customers",
    KeySchema: [
        { AttributeName: "user_name", KeyType: "HASH"},  //Partition key
        { AttributeName: "user_type", KeyType: "RANGE" },  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "user_name", AttributeType: "S" },
        { AttributeName: "user_type", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
