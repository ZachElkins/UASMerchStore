
<?php
include 'smtp.php';

if(isset($_REQUEST["submit"])) {
  ini_set('SMTP', $smtp_addr);
  ini_set('smtp_port', $smtp_port);
  
  $total_price = 0;
  $total_items = 0;
  $style  = "<head><link href='https://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet'></head>";
  $style .= "<style type='text/css'>";
  $style .= "body { font-family: Ubuntu;}";
  $style .= "table { margin: 0px auto; width: 750px; border-collapse: collapse; background-color: #eee;}";
  $style .= "table, th, td, caption { border: 2px solid #aaa; padding: 10px; }";
  $style .= "tr, caption { text-align: center; font-size: 24px; }";
  $style .= "th { font-style: italic; font-weight: lighter; }";
  $style .= "caption { border: 2px solid #aaa; }";
  $style .= "</style>";

  $order_info .= "<table>";
  $order_info .= "<caption>".$_REQUEST["name"]."'s Order<br/>(".$_REQUEST["department"].")</caption>";
  $order_info .= "<tr>";
  $order_info .= "<th style='width: 30%'>Name</th>";
  $order_info .= "<th style='width: 15%'>Size</th>";
  $order_info .= "<th style='width: 15%'>Qty.</th>";
  $order_info .= "<th style='width: 30%'>Price</th>";
  $order_info .= "</tr>";

  for ($i = 0; $i <= 1000; $i++) {
    if(isset($_REQUEST["name".$i])) {
      $order_info .= "<tr>";
      $order_info .= "<td>".$_REQUEST["name".$i]."</td>";
      $order_info .= "<td>".$_REQUEST["size".$i]."</td>";
      $order_info .= "<td>".$_REQUEST["quantity".$i]."</td>";
      $order_info .= "<td>$".$_REQUEST["price".$i]."</td>";
      $order_info .= "</tr>";
      $total_price += floatval($_REQUEST["price".$i]);
      $total_items += intval($_REQUEST["quantity".$i]);
    }
  }
  
  $order_info .= "<tr>";
  $order_info .= "<td colspan='2'>Total Items: ".$total_items."</td>";
  $order_info .= "<td colspan='2'>Total Price: $".$total_price."</td>";
  $order_info .= "</tr>";
  $order_info .= "</table>";

  $to       = 'store_orders@uas.com';
  $subject  = 'New Order';
  $message  = "<html><body style='font-family: sans-serif'>";
  $message .= $style;
  $message .= $order_info;
  $message .= "<br>";
  $message .= "<i style='font-size: 15px'> Please send a confirmation email through this <a href='http://uasweb/store/response'>template</a>.</i>";
  $message .= "<br><br><br><br><br><br><br><br><br><br><br><br>";
  $message .= '</body></html>';

  $confirm_to       = $_REQUEST["email"];
  $confirm_subject  = 'Order Confirmation';
  $confirm_message  = "<html><body style='font-family: sans-serif'>";
  $confirm_message .= $style;
  $confirm_message .= $order_info;
  $confirm_message .= "<br>";
  $confirm_message .= "<i style='font-size: 15px'> You will receive a second confirmation email when your order has been received. <br><br>";
  $confirm_message .= "If you have any questions, comments or concerns about this order please submit a ";
  $confirm_message .= "<a href='http://uasweb/store/tickets'>ticket</a>, and we will get back to you as soon as possible.</i><br>";
  $confirm_message .= "<br><br><br><br><br><br><br><br><br><br><br><br>";
  $confirm_message .= '</body></html>';

  $headers = 'From: store_orders@uas.com' . "\r\n" .
    'Reply-To: store_orders@uas.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion() . "\r\n" .
    'Content-Type: text/html; charset="ISO-8859-1' . "\r\n";

  if(mail($to, $subject, $message, $headers)) {


    echo "Order From: " . $_REQUEST["name"] . " in " . $_REQUEST["department"];
    echo "<br />Orders can take up to 30 minutes to be recieved";

	if(mail($confirm_to, $confirm_subject, $confirm_message, $headers)) {

		echo "<br />confirmation email sent to ".$_POST["email"];
                header("Location: http://uas-intranet/SitePages/Home.aspx");

	} else {

	  echo "<br />confirmation email failed to send. Please contact example@uas.com to confirm your order was placed";

	}

  } else {

    echo "<br />order failed to send please wait a few minutes to <a href='http://uasweb/store'>try again</a>. If the the problem persist please <a href='http://uasweb/store/tickets'>submit a ticket.</a>";

  }
} else {
  header('Location: http://uasWeb/webStore');
}
?>
