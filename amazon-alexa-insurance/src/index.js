/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

var AWS = require("aws-sdk");
AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAJJZLYEPMGLWOUSVQ";
AWS.config.secretAccessKey = "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";
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});


/*SPEECH STRINGS, FLAGS, VARIABLES*/
//=============================================================================================================================================
var APP_ID = undefined;
var SKILL_NAME = "Hackday";
var TIME_OUT = "Are you still there?";
var HELP_MESS = "You can say, I want to file a claim, I want to call an agent, or say I want to exit";
var GREET_PROMPT = "Welcome to the Hackday App. Are you a neew or returning user?";
var STOP_MESS = "Thanks for using the Hackday App";

var AUTO_OR_HOME = "Do you want to file an auto or home claim";
var LICNUM = "Now, please state your license number in this format. 'My license number is: ";
var ACQUIRE_NAME = "What is your first name?. Please say it in this format. 'My name is:'";
var INC_DATE = "Next, please specify the month, day, and year of the incident in this format. 'The incident happened on:"; 
var ACQUIRE_BD = "Next, please state your date of birth by month, day, and year in this format. My date of birth is: ";
var ACQUIRE_SECQUESTION = "Next, for security purposes, please state your favorite animal in the following format. 'My favorite animal is a: ";

var CHECK_NAME = "Your User ID is your first name. Please state your User ID with this format. 'My User ID is: ";
var CHECK_POLICY = "Your Policy ID is your policy number. Please state your Policy ID with this format. 'My policy ID is: '";
var CHECK_DOB = "Now we will verify that the account is yours. Please state your date of birth with this format. 'I was born on: '";
var CHECK_QUESTION = "The last step of verification is your security question. What is your favorite animal? Please answer in following format. 'My answer is: '";
var VERIFICATION_COMPLETE = "You have succesfully finished verification. Which type of claim would you like to set up an assessment for? Please state either Auto, Home, or Life in this format. 'I would like to make a blank claim";
var ASK_APT = "Which date would you like to make an assesment appointment for? Please answer in this format. 'I would like to make an appointment for: '"; 
 
var name;
var type;
var polnum;
var date;
var licensenum;
var addr;
var securityanswer;

var namecheck;
var questioncheck;
var claimtype;
var aptdate;

var nameflag = 0;
var addressflag = 0;
var birthdateflag = 0;
var licenseflag = 0;
var policyflag = 0;
var securityflag = 0;

var namecheckerflag = 0;
var questioncheckerflag = 0;
var claimflag = 1;
var aptflag = 0;
var success;


//addToTable();

const handlers = {
        
    'LaunchRequest': function () {
        this.emit(':ask', GREET_PROMPT);
    },
   
/*NEW USER*/
//=============================================================================================================================================
    'NewUser': function () {
        nameflag = 1;
        this.emit(':ask', ACQUIRE_NAME, ACQUIRE_NAME);
    },
    'Name': function () {
        if(nameflag === 1)
        {
            nameflag = 0;
            addressflag = 1;
            name = this.event.request.intent.slots.username.value;
            this.emit(':ask', "Hello, " + name + ", can you state your address in this format. 'My address is: ", "Hello, " + name + ", can you state your address in this format. 'My address is: ");
        }
    },
    'Address': function () {
        if(addressflag === 1)
        {
            addressflag = 0;
            //birthdateflag = 1;
            licenseflag = 1;
            addr = this.event.request.intent.slots.addr.value;
           // this.emit(':ask', ACQUIRE_BD, ACQUIRE_BD);
            this.emit(':ask', LICNUM, LICNUM);
        }
    },
/*    'Birthdate': function()
    {
        if(birthdateflag === 1){
            birthdateflag = 0;
            licenseflag = 1;
            date = this.event.request.intent.slots.day.value;
            this.emit(':ask', LICNUM, LICNUM);
        }
    },*/
    'LicenseNum': function()
    {
        if(licenseflag === 1){
            licenseflag = 0;
            securityflag = 1;
            licensenum = this.event.request.intent.slots.licnum.value;
            //addToTable(name, type, polnum, date, licensenum);
            this.emit(':ask', ACQUIRE_SECQUESTION, ACQUIRE_SECQUESTION);
        }
    },
    'SecurityQuestion': function()
    {
        if(securityflag === 1){
            securityflag = 0;
            policyflag = 1;
            securityanswer = this.event.request.intent.slots.animal.value;
            //addToTable(name, type, polnum, date, licensenum);
            this.emit('PolicyNumber');
        }
    },
    'PolicyNumber': function()
    {
        if(policyflag === 1)
        {
            policyflag = 0;
            polnum = Math.floor(Math.random() * 8999 + 1000)
            addToTable(name, polnum, date, securityanswer, licensenum, addr);
            this.emit(':ask', "Your generated policy number is " + polnum + "."); // ". Thank you very much. Here is your account summary. Your name is " + name + " and your address is " + addr + ". Your date of birth is " + date + ". Your license numnber is "  + licensenum + ". Your security question answer is " + securityanswer + ". Finally, your policy number is " + polnum + ". Thank you for creating an account!");
        }
    },
    
/*RETURNING USER*/
//=======================================================================================================================================================
   'ReturningUser': function()
   {
        namecheckerflag = 1;
        this.emit(':ask', CHECK_NAME, CHECK_NAME);  
   },
   'NameChecker': function()
   {
        if(namecheckerflag === 1){
            namecheckerflag = 0;
            questioncheckerflag = 1;
            namecheck = this.event.request.intent.slots.idname.value;
            this.emit(':ask', CHECK_QUESTION, CHECK_QUESTION);
        }
   },
   'QuestionChecker': function()
   {
       if(questioncheckerflag === 1){
           questioncheckerflag = 0;
           questioncheck = this.event.request.intent.slots.answer.value;
           success = queryTable(namecheck, questioncheck);
           if(success === 0){
               this.emit('AMAZON.StopIntent');
           }
           claimflag = 1;
           this.emit(':ask', VERIFICATION_COMPLETE , VERIFICATION_COMPLETE);
       }
       
   }, 
   'Contact':function()
   {
       
   },
   'Claim':function()
   {
       if(claimflag === 1){
           claimflag = 0;
           aptflag = 1;
           claimtype = this.event.request.intent.slots.type.value;
           this.emit('Appointment');
       }
       
   },
   'Appointment': function()
   {
        this.emit("You now have a " + claimtype + " assessment appointment scheduled for June 22nd, 2017. A representative will see you there!");
   },
   

/*AMAZON DEFAULT INTENTS*/
//========================================================================================================================================================
    'AMAZON.HelpIntent': function () {
        const speechOutput = (HELP_MESS);
        const reprompt = (HELP_MESS);
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', (STOP_MESS));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', (STOP_MESS));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);

    alexa.execute();
};


function addToTable(name, polnum, date, securityanswer, licensenum, addr){


var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Customers";

var params = {
  TableName: table,
  Item: {
      
     "user_name": name,
     "user_type": "NA",
     "info": {
       "user_policy_number": polnum,
       "user_DOB": date,
       "user_security_question": securityanswer,
       "user_license_num": licensenum,
       "user_address": addr
    }
  }
};

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});
}

function queryTable(name, securityanswer) {
    var docClient = new AWS.DynamoDB.DocumentClient()
    
    var table = "Customers";
    
    var user_name = name;
    var user_security_question = securityanswer;
    
    var params = {
        TableName: table,
        FilterExpression: 'user_name = :name_query and info.user_security_question = :security_query',
        ExpressionAttributeValues: {
                ":name_query": user_name,
                ":security_query": user_security_question
            }
    };
    
    docClient.scan(params, function(err, data)
    {
        if (err) 
        {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            return 0;
        } 
        else 
            {
                if (data.Count !== 0) 
                {
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                    return 1;
                } 
                else 
                {
                    return 0;
                }
            }
    }
    // var queried_obj = data.Items[0];
    // console.log(obj.user_name);
    );
}

