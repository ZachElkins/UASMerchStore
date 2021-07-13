<?php
include '../smtp.php';

if(isset($_REQUEST["submit"])) {
  ini_set('SMTP', $smtp_addr);
  ini_set('smtp_port', $smtp_port);

  $to       = 'zache@uas.com';
  $subject  = "TICKET: " . $_REQUEST["subject"];
  $message  = "<html><head><link href='https://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet'></head>";
  $message .= "<body style='font-family: sans-serif; font-size: 15px'>";
  $message .= "From : " . $_REQUEST["name"] . "<br>";
  $message .= "Department: " . $_REQUEST["department"] . "<br>";
  $message .= "Email: " . $_REQUEST["email"] . "<br><br>";
  $message .= "Subject: "  . $_REQUEST["subject"] . "<br><br>";
  $message .= "Message: " . nl2br(str_replace(" ", "&nbsp", $_REQUEST["message"]));

  $ticket_confirmation  = $message;
  $ticket_confirmation .= "<br><br><i>Once your ticket has been reviewed you will receive an email response on the status of the ticket.</i>";
  $ticket_confirmation .= "<br><br><br><br><br><br><br><br><br><br><br><br>";
  $ticket_confirmation .= "</body></html>";

  $message .= "<br><br>";
  $message .= "<i>Please respond to this ticket through this <a href='http://uasweb/store/response'>template</a>.</i>";
  $message .= "<br><br><br><br><br><br><br><br><br><br><br><br>";
  $message .= "</body></html>";

  $headers = 'From: no-reply@uas.com' . "\r\n" .
    'Reply-To: no-reply@uas.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion() . "\r\n" .
    'Content-Type: text/html; charset="ISO-8859-1' . "\r\n";
  
  if(mail($to, $subject, $message, $headers)) {
    echo "Ticket successfully submitted.";
    echo "<br>";
      if(mail($_REQUEST["email"], "Ticket Sent", $ticket_confirmation, $headers)) {
    	header("Location: http://uas-intranet/SitePages/Home.aspx");
	echo "Confirmation email successfully sent.";
	echo "<br>";
      } else {
	echo "Confirmation email failed to send.";
	echo "<br>";
	echo "Something went wrong sending your confirmation email, please wait for a response or <a href='http://uasweb/store/tickets'>clicking here</a> to send another ticket.";
	echo "<br>";
      }
  } else {
    echo "Something went wrong sending your ticket, please wait a few minutes and try again by <a href='http://uasweb/store/ticket'>clicking here</a>";
  }
} else {
  header("Location: http://uasweb/webStore/ticket.html");
}
 
?>