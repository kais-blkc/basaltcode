
<?php
  header('Content-Type: application/json; charset=utf-8');

  // Configs
  $env = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/.env');
  $botToken = $env['TELEGRAM_BOT_TOKEN'];
  $chatId = $env['TELEGRAM_CHAT_ID'];

  if (!$botToken || !$chatId) {
    echo json_encode(['ok' => false, 'message' => 'Telegram bot token or chat ID is not set']);
    exit;
  };

  // Form data
  $name = $_POST['name'];
  $phone = $_POST['phone'];
  $telegram = $_POST['telegram'];
  $service = $_POST['service'];

  // Message text
  $text = "📩 Новая заявка с сайта:\n";
  $text .= "👤 Имя: $name\n";
  $text .= "📞 Телефон: $phone\n";
  $text .= "💬 Telegram: $telegram\n";
  $text .= "⚙️ Услуга: $service";

  // Send message
  $sendUrl = "https://api.telegram.org/bot{$botToken}/sendMessage?";
  $params = http_build_query([
    'parse_mode' => 'HTML',
    'chat_id' => $chatId,
    'text' => $text,
  ]);
  $response = file_get_contents($sendUrl . $params);

  // Check result
  if ($response) {
    echo json_encode(['ok' => true, 'message' => '✅ Заявка отправлена!']);
  } else {
    echo json_encode(['ok' => false, 'message' => '❌ Ошибка отправки']);
  }
?>