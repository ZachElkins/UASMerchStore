<?php
include '../smtp.php';

if(isset($_REQUEST["submit"])) {
  ini_set('SMTP', $smtp_addr);
  ini_set('smtp_port', $smtp_port);

  $to       = $_REQUEST["email"];
  $message  = "<html><head><link href='https://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet'></head>";
  $message .= "<br>";
  $message .= "<body style='font-family: sans-serif; font-size: 15px'>";
  $message .= $_REQUEST["name"] . ",<br><br>";

  if($_REQUEST["response"] == "order") {
    $subject  = "Second Order Confirmation";
    $message .= "Your order of ". $_REQUEST["qty"] ." item(s) totaling $" . $_REQUEST["price"] . " has been received.<br>";
    $message .= "<br>";
    $message .= "Any changes to your order must be submitted through a <a href='http://uasweb/store/tickets'>ticket</a>.<br>";
    $message .= "<br>";
    $message .= "Tickets will only be valid if submitted before the next set of orders are placed.<br>";
    $message .= "<br>";
    $message .= "Your order will be placed on approximately " . $_REQUEST["date"] . " (yyyy-mm-dd).<br>";
    $message .= "<br>";
    if(strlen(trim($_REQUEST['notes']))) {
      $message .= "<div style='border-left: 4px solid #000'>";
      $message .= "<div style='background-color: #efefef; border-left: 10px solid #f4d442;'>";
      $message .= "<div style='border: 10px solid #efefef;'>";
      $message .= "<i style='font-size: 17px'><b><u>Additional Notes:</u></i><br>";
      $message .= "<div style='border-left: 10px solid #efefef'>";
      $message .= "<br>";
      $message .= nl2br(str_replace(" ", "&nbsp", $_REQUEST["notes"]));
      $message .= "</div>";
      $message .= "</div>";
      $message .= "</div>";
      $message .= "</div></b>";
      $message .= "<br>";
      $message .= "<br>";
    }
    $message .= "Thank you for your order.";
  } else if ($_REQUEST["response"] == "ticket") {
    $subject  = "Ticket Response";
    $message .= "Your ticket has been processed " . $_REQUEST["suc"] . ".  <br>";
    $message .= "<br>";
    $message .= nl2br(str_replace(" ", "&nbsp", $_REQUEST["details"])) . "<br>";
    $message .= "<br>";
    if(isset($_REQUEST["apology"])) {
      $message .= "We apologize for any inconvenience.<br>";
    }
  }

  $message .= "<br><br><br><br><br><br><br><br><br><br><br><br>";
  $message .= "</body></html>";
  
  $headers = 'From: no-reply@uas.com' . "\r\n" .
    'Reply-To: no-reply@uas.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion() . "\r\n" .
    'Content-Type: text/html; charset="ISO-8859-1' . "\r\n";

  if(mail($to, $subject, $message, $headers)) {
    echo "Response message sent.";
    header("Location: http://uasweb/store/response/");
  } else {  
    echo "Response message failed to send.";
  }

} else {
  header("Location: http://uasweb/store/response");
}
?>