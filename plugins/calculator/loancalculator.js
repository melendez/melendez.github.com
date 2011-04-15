//-->
// Copyright (c) 2000 by Go Daddy Software, Inc.  All rights reserved.
// Author: Bob Parsons,  January 31, 2000
// Revision: November 17, 2005 RCanedo - handle multiple calculator forms on a web page

var lc_sHoldLoanAmount,lc_sHoldAPR,lc_sHoldTerm,lc_isNetscape,lc_isIE;

//Determines which browser is in use for purposes of determining keypress values.
//See onkeypress event handlers
if (parseInt(navigator.appVersion)>= 4) {
 if (navigator.appName == "Netscape") {
  lc_isNetscape = true
  } else
    lc_isNetscape = false
  } else lc_isIE = false 
  
  
function lc_StripNonNumeric(sText) {

  var bNumber;
  var bFirstDecPlace = false;
  var sNumericText = "";
  var sText1 = ""; //Let browsers know we're working with a string object
  sText1 = sText;
  if (sText1.length > 0) 
    {
	  for (i=0;i<sText1.length;i++)
	   {
	     bNumber = false;
	     bNumber = !isNaN(sText1.charAt(i));
	     if ((!bNumber) && (!bFirstDecPlace) && (sText1.charAt(i) == '.'))
	      {
	        bNumber = true;
	        bFirstDecPlace = true;
	      }
	     if (bNumber) sNumericText += sText1.charAt(i); 	     
	   }	
    }
    
    //Set the string to null if it consists only of a decimal place
    if ((sNumericText.length == 1) && (sNumericText.charAt(0) == '.'))
     sNumericText = "";
     
    return sNumericText;
} 

function lc_ReportError(sWay,sLimit,tBox,sHold)
//Displays error msgbox when min/max limits are exceeded.
{
	//ORGINAL
	/*
	alert(sWay+"imum value is "+sLimit);
	*///end ORIGNAL
	
	//NEW 4/14/11
	document.getElementById('loanError').innerHTML = sWay+"imum value is "+sLimit;
	$('#loanError').show();
	//end NEW
	
	tBox.value = sHold;
	tBox.focus();
	return true
} 

function lc_InsertDecPlaces(sText,iDecPlaces) {
    var i = sText.length;
    var bPlaceFound,iPlaces;
    bPlaceFound = false;
    
    while ((i > -1) && (!bPlaceFound)) {
      i--;
      bPlaceFound = (sText.charAt(i) == '.');
    }
    if (!bPlaceFound) {
       sText += '.';
       i = sText.length - 1; }
       
    iPlaces = sText.length - (i+1);
    while (iPlaces < iDecPlaces) {
      sText += '0';
      iPlaces++;
    }
    
    return sText;
}


function lc_InsertCommas(sText,bPennies)
	{
	  var sCommaText = "";
	  var iDigits = 0;
	  
	  if (bPennies) iDigits = (-3); //two pennies plus decimal point
      for (i=sText.length-1;i>-1;i--)
       {   
           if (iDigits == 3) 
            {
               sCommaText = ','+ sCommaText;
               iDigits = 0;
            }   
            
           sCommaText = sText.charAt(i)+sCommaText;
           iDigits++;
       }
       
       return "$" + sCommaText;
	}


function lc_FormatAndSetText(fValue,iDecPlaces,sType,tBox) {
   var sText = "";
   var iValue,iMultiplier;
   
   iMultiplier = 1.0;
   for (i=0;i<iDecPlaces;i++) iMultiplier = iMultiplier * 10;
   
   fValue = fValue * iMultiplier;
   iValue = Math.round(fValue)
   iValue = iValue / iMultiplier;
   
   sText = iValue.toString(10); //Base 10
   
   if (sType == '$') {
    sText = lc_InsertDecPlaces(sText,iDecPlaces);
    sText = lc_InsertCommas(sText,true);  //Loan Amount
    lc_sHoldLoanAmount = sText; }
    
   if (sType == '%') {  //Annual Interest Rate
    sText = lc_InsertDecPlaces(sText,iDecPlaces);	
    sText += '%';
    lc_sHoldAPR = sText;  }
    
   if (sType == 'Y') {  //Term of Loan
    sText += " year";
    if (iValue > 1.0) sText += 's';
    lc_sHoldTerm = sText;
   }
   
   if (sType == 'P') {  //Computed Monthly Loan Payment
    sText = lc_InsertDecPlaces(sText,iDecPlaces);
    sText = lc_InsertCommas(sText,true);
    tBox.value = sText;
    } else {
			tBox.value = sText;
			}
   //NEW 
	$('#loanError').hide();
	//end new
   return true;
}

function lc_ConvertToFloat(sText) {
  sText = lc_StripNonNumeric(sText);
  if ((sText == "") || (sText == ".")) sText = "0";
  return parseFloat(sText);
}

 
function lc_ProcessInput(sText,fMin,fMax,sMin,sMax,iDecPlaces,sType,tBox,sHold) {
  var bError = false;
  fValue = lc_ConvertToFloat(sText);
  if (fValue < fMin) bError = lc_ReportError("Min",sMin,tBox,sHold);
  if (fValue > fMax) bError = lc_ReportError("Max",sMax,tBox,sHold);
  
  if (!bError)
		lc_FormatAndSetText(fValue,iDecPlaces,sType,tBox); 
  return true;
}

function lc_ReturnKey(evt)
{
   var theKeyPressed, bReturnKey;
	if (lc_isNetscape) theKeyPressed = evt.which
   else theKeyPressed = window.event.keyCode;
   bReturnKey = (theKeyPressed == 13);
   return bReturnKey;
}

function lc_EscapeKey(evt)
{
   var theKeyPressed, bEscapeKey;
   if (lc_isNetscape) theKeyPressed = evt.which
   else theKeyPressed = window.event.keyCode;
   bEscapeKey = (theKeyPressed == 27);
   return bEscapeKey;
}   

// RBC Modified 11/18/2005
function lc_text_LoanAmount_onfocus(el) {
  el.select();
  lc_sHoldLoanAmount = el.value;
  return true;
}

// RBC Modified 11/18/2005
function lc_text_LoanAmount_onchange(el) {
 lc_ProcessInput(el.value,1000.0,99999999.0,"$1,000","$99,999,999",2,'$',el,lc_sHoldLoanAmount);
 return true;
}

// RBC Modified 11/18/2005
function lc_text_LoanAmount_onkeypress(evt, el) {
  if (lc_ReturnKey(evt)) lc_text_LoanAmount_onchange(el); 
  if (lc_EscapeKey(evt)) el.value = lc_sHoldLoanAmount;
  return true;      
}

// RBC Modified 11/18/2005
function lc_text_APR_onchange(el) {
 lc_ProcessInput(el.value,1.0,50.0,"1.000%","50.000%",3,'%',el,lc_sHoldAPR);
return true; 
}

// RBC Modified 11/18/2005
function lc_text_APR_onfocus(el) {
 el.select();
 lc_sHoldAPR = el.value;
 return true;
}

// RBC Modified 11/18/2005
function lc_text_APR_onkeypress(evt, el) {
  if (lc_ReturnKey(evt)) lc_text_APR_onchange(el); 
  if (lc_EscapeKey(evt)) el.value = lc_sHoldAPR;
  return true;      
}

// RBC Modified 11/18/2005
function lc_text_Term_onchange(el) {
	lc_ProcessInput(el.value,1.0,100.0,"1 Year","100 Years",3,'Y',el,lc_sHoldTerm);
}

// RBC Modified 11/18/2005
function lc_text_Term_onfocus(el) {
 el.select();
 lc_sHoldTerm = el.value;
 return true;
}

// RBC Modified 11/18/2005
function lc_text_Term_onkeypress(evt, el) {
 if (lc_ReturnKey(evt)) lc_text_Term_onchange(el); 
 if (lc_EscapeKey(evt)) el.value = lc_sHoldTerm;
 return true; 
}

// RBC Modified 11/18/2005
function lc_ComputeMonthlyPayment(theButton, calcForm) {
	var fPayment,fTerm,fRate,fLoan;
  
  // RBC Modified 11/18/2005
  var el = lc_GetFormElementById(calcForm, "text_APR");  
  fRate = lc_ConvertToFloat(el.value);  
  el = lc_GetFormElementById(calcForm, "text_Term");
  fTerm = lc_ConvertToFloat(el.value);  
  el = lc_GetFormElementById(calcForm, "text_LoanAmount");
  fLoan = lc_ConvertToFloat(el.value);  
  fRate = fRate/(12.0*100); //Get monthly and convert to decimal equivalent
  fTerm = fTerm * 12.0; //Convert to months
  
  fPmt = fLoan * (fRate/(1.0 - Math.pow((1.0+fRate),-fTerm)));
  
	// RBC - Added 11/18/2005
	var el = lc_GetFormElementById(calcForm, "text_Payment");
  
  // RBC Modified 11/18/2005
  lc_FormatAndSetText(fPmt,2,'P',el);
}

function lc_DataNotEntered(tBox,sMessage) {
 var bTest = false;
 if (tBox.value == "Entry required") {
  
//ORIGINAL
 /*
  alert(sMessage);
*/
//end ORIGINAL
	 
//NEW
document.getElementById('loanError').innerHTML = sMessage;
$('#loanError').show();
//end NEW
	
  tBox.focus();
  bTest = true;
 }
 return bTest;
}

// RBC Modified 11/18/2005
function lc_RequiredDataHasBeenEntered(calcForm) {
 var bError = false;
 
 // RBC Modified 11/02/2005
 var el = lc_GetFormElementById(calcForm, "text_LoanAmount");
  if (lc_DataNotEntered(el,"Loan amount must be entered.")) 
   bError = true;
  
  el = lc_GetFormElementById(calcForm, "text_APR");
  if ((!bError) && (lc_DataNotEntered(el,"Interest rate must be entered.")))
   bError = true;
  
 return !bError;
}

// RBC Modified 11/18/2005
function lc_button_Calculate_onclick(el, calcFormId) {
	var calcForm = el.form;	
	if (lc_RequiredDataHasBeenEntered(calcForm))
		lc_ComputeMonthlyPayment(el, calcForm);	
}

// RBC Added 11/18/2005
function lc_button_Reset_onclick(el, calcFormId)
{
	var calcForm = el.form;
	calcForm.reset();	
}

// RBC Added 11/18/2005
function lc_GetFormElementById(formToSearch, id)
{
	var calcFormId = lc_GetCalcFormId(formToSearch);
	var searchId = id + "_" + calcFormId;
	for (var i=0; i < formToSearch.elements.length; i++)
	{		
		if (formToSearch.elements[i].id == searchId)
			return formToSearch.elements[i];
	}
	return null;
}

// RBC Added 11/18/2005
function lc_GetCalcFormId(formToSearch)
{
	if (formToSearch)
	{
		return formToSearch.id.substr(formToSearch.id.lastIndexOf("_") + 1);
	}
}