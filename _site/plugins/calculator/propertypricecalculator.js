//Copyright(c) 2000 by Go Daddy Software, Inc.  All Rights Reserved.
//Author: Bob Parsons (with much help from Angel Carradus)
//Revision: February 9, 2000 3:30 PM
//Revision: November 2, 2005 RCanedo - handle multiple calculator forms on a web page

var ppc_sHoldPayment,ppc_sHoldAPR,ppc_sHoldDownpayment,ppc_sHoldTerm,ppc_isNetscape;

//Determines which browser is in use for purposes of determining keypress values.
//See onkeypress event handlers

if (navigator.appName == "Netscape") 
  ppc_isNetscape = true 
else
  ppc_isNetscape = false 
   
  
function ppc_StripNonNumeric(sText) {

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
	     // For some reason !isNaN evaluates a space as a number
	     if (sText1.charAt(i) == ' ') bNumber = false;
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

function ppc_ReportError(sWay,sLimit,tBox,sHold)
//Displays error msgbox when min/max limits are exceeded.
{
	//ORIGINAL
	/*
	alert(sWay+"imum value is "+sLimit+".");
	*///end ORIGNAL
	
	//NEW 4/14/11
	document.getElementById('propertyError').innerHTML = sWay+"imum value is "+sLimit+".";
	$('#propertyError').show();
	//end NEW
	
	tBox.value = sHold;
	tBox.focus();
	return true
} 

function ppc_InsertDecPlaces(sText,iDecPlaces) {
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


function ppc_InsertCommas(sText,bPennies)
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

function ppc_FloatToString(fValue,iDecPlaces) {
   var sText = "";
   var iValue,iMultiplier;
   
   iMultiplier = 1.0;
   for (i=0;i<iDecPlaces;i++) iMultiplier = iMultiplier * 10;
   
   fValue = fValue * iMultiplier;
   iValue = Math.round(fValue)
   iValue = iValue / iMultiplier;
   
   sText = iValue.toString(10); //Base 10
   return sText;
}

function ppc_FormatText(fValue,iDecPlaces,sType) {
   var sText = "";
   
   sText = ppc_FloatToString(fValue,iDecPlaces);
   
   if (sType == '$') {
    sText = ppc_InsertDecPlaces(sText,iDecPlaces);
    sText = ppc_InsertCommas(sText,true);  //Loan Amount
 }
    
   if (sType == '%') {  //Annual Interest Rate
    sText = ppc_InsertDecPlaces(sText,iDecPlaces);	
    sText += '%';
  }
    
   if (sType == 'Y') {  //Term of Loan
    sText += " year";
    if (iValue > 1.0) sText += 's';
  
   }
   
   if (sType == 'P') {  //Computed Monthly Loan Payment
    sText = ppc_InsertDecPlaces(sText,iDecPlaces);
    sText = ppc_InsertCommas(sText,true);
  }
      
   return sText;
}

function ppc_ConvertToFloat(sText) {
  sText = ppc_StripNonNumeric(sText);
  if ((sText == "") || (sText == ".")) sText = "0";
  return parseFloat(sText);
}

// RBC Modified 11/02/2005
function ppc_ResetAnswers(calcForm) {
	var el = ppc_GetFormElementById(calcForm, "text_Price");
	el.value = "";
}

function ppc_FormatAndSetText(fValue,iDecPlaces,sType,tBox) {
   var sText = "";
   var iValue,iMultiplier;
   
   iMultiplier = 1.0;
   for (i=0;i<iDecPlaces;i++) iMultiplier = iMultiplier * 10;
   
   fValue = fValue * iMultiplier;
   iValue = Math.round(fValue)
   iValue = iValue / iMultiplier;
   
   sText = iValue.toString(10); //Base 10
   
   if ((sType == '$') || (sType == 'D')) {
    sText = ppc_InsertDecPlaces(sText,iDecPlaces);
    sText = ppc_InsertCommas(sText,true);  //Monthly Payment or Downpayment
    if (sType == '$') ppc_sHoldPayment = sText;
     else ppc_sHoldDownpayment = sText; }
    
   if (sType == '%') {  //Annual Interest Rate
    sText = ppc_InsertDecPlaces(sText,iDecPlaces);	
    sText += '%';
    ppc_sHoldAPR = sText;  }
    
   if (sType == 'Y') {  //Term of Loan
    sText += " year";
    if (iValue > 1.0) sText += 's';
    ppc_sHoldTerm = sText;
   }
    
   if (sType == 'A') {  //Affordability
    sText = ppc_InsertCommas(sText,false);
    tBox.value = sText;
    } else {
			tBox.value = sText;
			// RBC Modified 11/02/2005
			ppc_ResetAnswers(tBox.form);
			
			 }
   
   //NEW
	$('#propertyError').hide();
//end NEW
   
   return true;
}
 
function ppc_ProcessInput(sText,fMin,fMax,sMin,sMax,iDecPlaces,sType,tBox,sHold) {
  var bError = false;
  fValue = ppc_ConvertToFloat(sText);
  if (fValue < fMin) bError = ppc_ReportError("Min",sMin,tBox,sHold);
  if (fValue > fMax) bError = ppc_ReportError("Max",sMax,tBox,sHold);
  
  if (!bError)
		ppc_FormatAndSetText(fValue,iDecPlaces,sType,tBox); 
  return true;
}

function ppc_ReturnKey(evt)
{
   var theKeyPressed, bReturnKey;
	if (ppc_isNetscape) theKeyPressed = evt.which
   else theKeyPressed = window.event.keyCode;
   bReturnKey = (theKeyPressed == 13);
   return bReturnKey;
}

function ppc_EscapeKey(evt)
{
   var theKeyPressed, bEscapeKey;
   if (ppc_isNetscape) theKeyPressed = evt.which
   else theKeyPressed = window.event.keyCode;
   bEscapeKey = (theKeyPressed == 27);
   return bEscapeKey;
}   

function ppc_InitSelectBox(selectBox,fIncrement,iCount,iDefault) {
 var fValue = 0;
 var ii,sText;
 var newElem;
 for (ii=0;ii<iCount;ii++) {
  sText = " " + ppc_FormatText(fValue,2,'%');
  newElem = new Option(sText);
  selectBox.options[ii] = newElem;
  fValue += fIncrement;
 }
 selectBox.selectedIndex = iDefault;
} 

//--ac--ADDED FUNCTION-------------------------------------------------------------------------
// This function will "snag" the query string and store it in a name/value dictionary.
function ppc_getArgs()
{
  var args = new Object();
  var query = location.search.substring(1);   // Get the query string.
  var pairs = query.split("&");               // Break at &
  for ( var i = 0; i < pairs.length; i++ )
  {
    var pos = pairs[i].indexOf('=');          // Look for the name/value pair
    if ( pos == -1 ) continue;                // not found so skip it.
    var argname = pairs[i].substring(0, pos); // Extract the name
    var value = pairs[i].substring(pos+1);    // Extract the value
    args[argname] = unescape(value);          // Store as a property
  }
  
  return args;  // Return the object.
}


//--ac--EDITED FUNCTION-------------------------------------------------------------------------
function ppc_window_onload() {
  ppc_InitSelectBox(document.formHM.select_ClosingCosts,0.05,101,60);
  ppc_InitSelectBox(document.formHM.select_MonthlyEscrow,0.05,61,22);
  var args = ppc_getArgs();
  if (args.text_Payment)
  {
   document.formHM.text_Payment.value = args.text_Payment;
   document.formHM.text_Downpayment.value = args.text_Downpayment;
   document.formHM.text_APR.value = args.text_APR;
   
   document.formHM.text_Term.value = args.text_Term + " year";
   if (ppc_ConvertToFloat(args.text_Term) > 1.0) document.formHM.text_Term.value += 's';
   
   document.formHM.select_ClosingCosts.selectedIndex = args.select_ClosingCosts
   document.formHM.select_MonthlyEscrow.selectedIndex = args.select_MonthlyEscrow
  }  
}

// RBC Added 11/02/2005
function ppc_InitializeDropDowns(calcForm)
{
	ppc_InitSelectBox(ppc_GetFormElementById(calcForm,"select_ClosingCosts"),0.05,101,60);
	ppc_InitSelectBox(ppc_GetFormElementById(calcForm,"select_MonthlyEscrow"),0.05,61,22);
}

// RBC Modified 11/02/2005
function ppc_text_Payment_onchange(el) {
 ppc_ProcessInput(el.value,50.0,100000.0,"$50","$100,000",2,'$',el,ppc_sHoldPayment);
return true; 
}

// RBC Modified 11/02/2005
function ppc_text_Payment_onfocus(el) {
 el.select();
 ppc_sHoldPayment = el.value;
 return true;
}

// RBC Modified 11/02/2005
function ppc_text_Payment_onkeypress(evt, el) {
 if (ppc_ReturnKey(evt)) ppc_text_Payment_onchange(el); 
 if (ppc_EscapeKey(evt)) el.value = ppc_sHoldPayment;
 return true;      
}

// RBC Modified 11/02/2005
function ppc_text_Downpayment_onchange(el) {
 ppc_ProcessInput(el.value,0.0,10000000.0,"zero","$10,000,000",2,'D',el,ppc_sHoldDownpayment);
}

// RBC Modified 11/02/2005
function ppc_text_Downpayment_onfocus(el) {
 el.select();
 ppc_sHoldDownpayment = el.value;
}

// RBC Modified 11/02/2005
function ppc_text_Downpayment_onkeypress(evt, el) {
 if (ppc_ReturnKey(evt)) ppc_text_Downpayment_onchange(el); 
 if (ppc_EscapeKey(evt)) el.value = ppc_sHoldDownpayment;
 return true;  
}

// RBC Modified 11/02/2005
function ppc_text_APR_onchange(el) {
 ppc_ProcessInput(el.value,1.0,50.0,"1.000%","50.000%",3,'%',el,ppc_sHoldAPR);
}

// RBC Modified 11/02/2005
function ppc_text_APR_onfocus(el) {
 el.select();
 ppc_sHoldAPR = el.value;
}

// RBC Modified 11/02/2005
function ppc_text_APR_onkeypress(evt, el) {
 if (ppc_ReturnKey(evt)) ppc_text_APR_onchange(el); 
 if (ppc_EscapeKey(evt)) el.value = ppc_sHoldAPR;
 return true;
}

function ppc_MakeLine(sDescrip,fValue,iPlaces) {
 var sText =  ppc_FloatToString(fValue,iPlaces);
 
 if (iPlaces == 0) sText = ppc_InsertCommas(sText,false)
  else 
   {    sText = ppc_InsertDecPlaces(sText,2);
        sText = ppc_InsertCommas(sText,true);     }
 
 sDescrip = "<tr><td>" + sDescrip + "</td>";
 sText = "<td style='padding-left:10px' align=right>" + sText + "</td></tr>";
  
 return (sDescrip + sText);
  
}

//--ac--ADDED FUNCTION-------------------------------------------------------------------------
// This function will snag the root URL off of a URL string.
// i.e. No query string.
function ppc_rootURL()
{
  var baseURL = "";
  var strURL = document.location.toString();
  pos = strURL.indexOf("?");  
  if ( pos != -1 )
    baseURL = strURL.substring(0, pos);
  else
    baseURL = strURL;
    
  return baseURL;
}

function ppc_ReportDetails(fAfford,fDown,fLoan,fClosingCosts,fPmt,fEscrow, calcForm)
{
	var sText = "";
	
	//--ac--ADDED THESE 7 LINES-------------------------------------------------------------------------
	strLocation  = ppc_rootURL();
	
	// RBC Modified 11/02/2005
	var el = ppc_GetFormElementById(calcForm, "text_Payment");
    strLocation += "?text_Payment=" + el.value;
    
    // RBC Modified 11/02/2005
	el = ppc_GetFormElementById(calcForm, "text_Downpayment");
    strLocation += "&text_Downpayment=" + el.value;
    
    // RBC Modified 11/02/2005
	el = ppc_GetFormElementById(calcForm, "text_APR");
    strLocation += "&text_APR=" + el.value;
    
    // RBC Modified 11/02/2005
	el = ppc_GetFormElementById(calcForm, "text_Term");
    sTest = ppc_StripNonNumeric(el.value);    
    strLocation += "&text_Term=" + ppc_StripNonNumeric(el.value);
   
    // RBC Modified 11/02/2005
	el = ppc_GetFormElementById(calcForm, "select_ClosingCosts");
    strLocation += "&select_ClosingCosts=" + el.selectedIndex.toString(10);
    
    // RBC Modified 11/02/2005
	el = ppc_GetFormElementById(calcForm, "select_MonthlyEscrow");
    strLocation += "&select_MonthlyEscrow=" + el.selectedIndex.toString(10);
    
	sText += "<HTML><HEAD><TITLE>Property Price Estimates And Assumptions</TITLE></HEAD><BODY>\n";

	//--ac--EDITED THIS LINE-------------------------------------------------------------------------
	sText += "<table align=center valign=top border=0 cellspacing=0 cellpadding=0>\n";
	sText += "<tr><th colspan=2 align=center>"+"Affordability Estimates and Assumptions"+ "</th></tr>\n";
	sText += "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>\n";
	sText += "<tr><th colspan=2 align=center>"+"Estimated Price of House"+ "</th></tr>\n";
      	
	sText += ppc_MakeLine("House's estimated sales price",fAfford,0);
	sText += ppc_MakeLine("Add: Estimated closing costs",fClosingCosts,0);
	sText += ppc_MakeLine("Total",fAfford+fClosingCosts,0);
	sText += ppc_MakeLine("Less: Downpayment",fDown,0);
	sText += ppc_MakeLine("Estimated mortgage loan required",fLoan,0);

	sText += "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>\n";
    sText += "<tr><th colspan=2 align=center>"+"Loan to Value"+ "</th></tr>\n";
	
	var sLTV = ppc_FloatToString((fLoan/fAfford)*100, 2);
   sText += "<tr><td>Loan to Value</td><td align=right>"+ppc_InsertDecPlaces(sLTV,2)+"%</td></tr>\n";

	sText += "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>\n";
    sText += "<tr><th colspan=2 align=center>"+"Monthly Payment Estimates"+ "</th></tr>\n";
	
	sText += ppc_MakeLine("Estimated payment for taxes &amp; insurance",fEscrow,2);
	sText += ppc_MakeLine("Estimated payment for principal &amp; interest",fPmt-fEscrow,2);
	sText += ppc_MakeLine("Total monthly housing payment",fPmt,2);
	sText += "</table><BR>\n";
		
	fPerCent = (fDown/(fAfford+fClosingCosts)) * 100;
	fWork = ppc_FloatToString(fPerCent,2);
	ppc_InsertDecPlaces(fWork,2);
	
	sText += "<table border=0 cellspacing=5 cellpadding=5>\n";
	sText += "<tr><th align=center>"+"The Above Numbers Are Only Estimates"+ "</th></tr>\n";	
	sText += "<tr><td>\n";
	sText += "Be aware that the above numbers are only estimates.  The amount of closing costs, \n";
	sText += "homeowner's insurance and property tax can vary widely from one geographic location to \n";
	sText += "another.  Other factors (such as the amount of downpayment, the necessity of mortgage insurance, etc.) \n";
	sText += "will influence how much house you can afford.  The above numbers are provided only as an \n";
	sText += "initial estimate and are only as accurate as the underlying assumptions.  Be sure \n";
	sText += "to consult your realtor and/or mortgage financing source for accurate, up-to-date information \n";
	sText += "as it relates to your particular situation.\n";
	sText += "</td></tr>\n";
	sText += "<tr><th align=center>"+"How The House Price Is Determined"+ "</th></tr>\n";
	sText += "<tr><td>\n";
	sText += "The estimated sales price of the house you can afford is determined by considering the amount \n";
	sText += "the monthly payment and downpayment affords without regard to possible limiting factors such as adequacy \n";
	sText += "of downpayment, your capacity to assume additional debt, etc.  Please be aware that these and other factors may influence \n";
	sText += "the amount of house you can afford.\n";
	sText += "</td></tr>\n";
	sText += "<tr><th align=center>"+"A Word About Mortgage Insurance"+ "</th></tr>\n";
	sText += "<tr><td>\n";
	sText += "The above downpayment is "+fWork+"% of the house's estimated sales price with closing costs. \n";
	sText += "The loan-to-value rate is  "+ppc_InsertDecPlaces(sLTV,2)+"%. ";
	sText += "You may be required to pay mortgage insurance on your home if your Loan-to-Value ratio is greater than 80%.  This ratio is computed as the value of the loan divided by the value of the home and indicates how much of the home you actually have a loan for.  A loan-to-value ratio of more than 80% means that you have less than 20% equity in the home you're purchasing, and many lenders will require mortgage insurance.<BR><BR>\n"
	sText += "Mortgage insurance is paid monthly and is added to the monthly escrow (or impound) amount you pay to cover homeowner's insurance and property taxes.  Annual mortgage insurance premiums are usually determined by multiplying the initial loan amount by anywhere from <% to 1% or more (depending on the loan-to-value ratio) and then dividing that amount by 12 to get the monthly amount.\n"
	sText += "</td></tr>\n";
	sText += "<tr><th align=center>"+"Many Factors Influence The Ability To Obtain Financing"+ "</th></tr>\n";
	sText += "<tr><td>\n";
	sText += "Many factors influence the cost of and ability to arrange for financing. Some key factors are \n";
	sText += "the price of the house you want to buy versus its appraisal value, your credit history, current debt burden, current employment, employment history, and amount \n";
	sText += "(and sometimes the source) of downpayment.  Please consult with your realtor or \n";
	sText += "mortgage financing source for additional information.\n";
	sText += "</td></tr></table>\n";
	sText += "</BODY></HTML>\n";
	
	var resultsWindowFeatures = "location=0,toolbar=0,status=0,menubar=0,resizable=1,dependent=1,height=500,width=500,scrollbars=1";
	var resultWindow = window.open("","CALC_PPC_RESULT", resultsWindowFeatures);
	resultWindow.document.open("text/html");
	resultWindow.document.write(sText);
	resultWindow.document.close();
	resultWindow.focus();
	
	//--ac--ADDED THIS LINE-------------------------------------------------------------------------
    return false;
	
}  

function ppc_GetSelectBoxValue(selectBox){
 var fValue = 0.0;
 var sText;
 iSelectIndex = selectBox.selectedIndex;
 sText = selectBox.options[iSelectIndex].text;
 return ppc_ConvertToFloat(sText);
}

function ppc_ComputeHowMuchHousePmtBuys(theButton, calcForm) {
  var fPmt,fTerm,fRate,fDown,fAfford,fClosingCosts,fEscrow;
  var fPmtFactor,fLoan,fClosingCostsPerCent,fEscrowPerCent;
  var fOldLoan;
  
  // RBC Modified 11/02/2005
  var el = ppc_GetFormElementById(calcForm, "text_APR");
  fRate = ppc_ConvertToFloat(el.value);
  el = ppc_GetFormElementById(calcForm, "text_Term");
  fTerm = ppc_ConvertToFloat(el.value);
  el = ppc_GetFormElementById(calcForm, "text_Payment");
  fPmt = ppc_ConvertToFloat(el.value);
  el = ppc_GetFormElementById(calcForm, "text_Downpayment");
  fDown = ppc_ConvertToFloat(el.value);
  el = ppc_GetFormElementById(calcForm, "select_ClosingCosts");
  fClosingCostsPerCent = ppc_GetSelectBoxValue(el)/100;
  el = ppc_GetFormElementById(calcForm, "select_MonthlyEscrow");
  fEscrowPerCent = ppc_GetSelectBoxValue(el)/100;
  
  fRate = fRate/(12.0*100); //Get monthly and convert to decimal equivalent
  fTerm = fTerm * 12.0; //Convert to months
  fEscrowPerCent = fEscrowPerCent/12; //Convert to monthly
  
  fPmtFactor = (fRate/(1.0 - Math.pow((1.0+fRate),-fTerm)));
  
  fLoan = fPmt/fPmtFactor; fOldLoan = 0;
  fEscrow = 0;
  fClosingCosts = 0;
  bFirstPass = true;
  
  //The following loops until the correct loan amount is determined.
  //Since the problem presents itself as a non-linear equation (at least that's
  //what the free equation solvers on the net indicate) the only way to come up
  //with the exact answer is by iteration.
  
  while (Math.abs(fLoan - fOldLoan)>1) {
  if (!bFirstPass) fOldLoan = fLoan; 
  bFirstPass = false;
  //Compute loan amount Note: The afford number will be high
  fLoan = (fPmt - fEscrow) / fPmtFactor;
  //Compute purchase price
  fAfford = fLoan + fDown - fClosingCosts;
  //Compute preliminary closing costs
  fClosingCosts = fAfford * fClosingCostsPerCent;
  //Compute preliminary escrow
  fEscrow = fAfford * fEscrowPerCent;
 }   
 
 // RBC - Added 11/11/2005
 var el = ppc_GetFormElementById(calcForm, "text_Price");
 
  ppc_FormatAndSetText(fAfford,0,'A',el);
  ppc_ReportDetails(fAfford,fDown,fLoan,fClosingCosts,fPmt,fEscrow, theButton.form);
}

function ppc_DataNotEntered(tBox,sMessage) {
 var bTest = false;
 if (tBox.value == "Entry required") {

//ORIGINAL	 
/*
  alert(sMessage);
 */
//end ORIGINAL
	
//NEW
	document.getElementById('propertyError').innerHTML = sMessage;
	$('#propertyError').show();
//end NEW
  
  tBox.focus();
  bTest = true;
 }
 return bTest;
}

// RBC Modified 11/02/2005
function ppc_RequiredDataHasBeenEntered(calcForm) {
 var bError = false;
 // RBC Modified 11/02/2005
 var el = ppc_GetFormElementById(calcForm, "text_Payment");
  if (ppc_DataNotEntered(el,"Monthly payment must be entered.")) 
   bError = true;
  
  // RBC Modified 11/02/2005
  el = ppc_GetFormElementById(calcForm, "text_Downpayment");
  if ((!bError) && (ppc_DataNotEntered(el,"Downpayment must be entered.  Enter '0' if there is none.")))
   bError = true;
  
  // RBC Modified 11/02/2005
  el = ppc_GetFormElementById(calcForm, "text_APR");
  if ((!bError) && (ppc_DataNotEntered(el,"Mortgage interest rate must be entered.")))
   bError = true;
  
 return !bError;
}


// RBC Modified 11/02/2005
function ppc_button_Calculate_onclick(el, calcFormId) {
 var calcForm = el.form;
 if (ppc_RequiredDataHasBeenEntered(calcForm)) 
   ppc_ComputeHowMuchHousePmtBuys(el, calcForm);  
}

// RBC Added 11/02/2005
function ppc_button_Reset_onclick(el, calcFormId)
{
	var calcForm = el.form;
	calcForm.reset();
	ppc_ResetAnswers(calcForm);
	ppc_InitializeDropDowns(calcForm);
	
	//NEW
	$('#propertyError').hide();
	//end NEW
}

// RBC Modified 11/02/2005
function ppc_text_Term_onchange(el) {
 ppc_ProcessInput(el.value,1.0,100.0,"1 Year","100 Years",3,'Y',el,ppc_sHoldTerm);
}

// RBC Modified 11/02/2005
function ppc_text_Term_onfocus(el) {
 el.select();
 ppc_sHoldTerm = el.value;
 return true;
}

// RBC Modified 11/02/2005
function ppc_text_Term_onkeypress(evt,el) {
 if (ppc_ReturnKey(evt)) ppc_text_Term_onchange(el); 
 if (ppc_EscapeKey(evt)) el.value = ppc_sHoldTerm;
 return true; 
}

// RBC Modified 11/02/2005
function ppc_select_ClosingCosts_onchange(el) {	
 ppc_ResetAnswers(el.form);
}

// RBC Modified 11/02/2005
function ppc_select_MonthlyEscrow_onchange(el) {
 ppc_ResetAnswers(el.form);
}

// RBC Added 11/02/2005
function ppc_GetFormElementById(formToSearch, id)
{
	var calcFormId = ppc_GetCalcFormId(formToSearch);
	var searchId = id + "_" + calcFormId;
	for (var i=0; i < formToSearch.elements.length; i++)
	{		
		if (formToSearch.elements[i].id == searchId)
			return formToSearch.elements[i];
	}
	return null;
}

// RBC Added 11/02/2005
function ppc_GetCalcFormId(formToSearch)
{
	if (formToSearch)
	{
		return formToSearch.id.substr(formToSearch.id.lastIndexOf("_") + 1);
	}
}

function ppc_TemplateHtmlSetup(templateId)
{
	var calcForm = document.getElementById("PropertyPriceCalculator_" + templateId);
	if (calcForm)
	{
		if (typeof(ppc_InitializeDropDowns) != "undefined")
			ppc_InitializeDropDowns(calcForm);	
	}
}