<?php
  header('Content-Type: application/json; charset=utf-8');

  $env = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/.env');
  $botToken = $env['TELEGRAM_BOT_TOKEN'];
  $chatId = $env['TELEGRAM_CHAT_ID'];

  if (!$botToken || !$chatId) {
    echo json_encode(['ok' => false, 'message' => 'Telegram bot token or chat ID is not set']);
    exit;
  };

  $formType = $_POST['form_type'] ?? 'default';

  if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
      $ip = $_SERVER['HTTP_CLIENT_IP'];
  } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
      $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
  } else {
      $ip = $_SERVER['REMOTE_ADDR'] ?? 'Неизвестно';
  }

  $country = '';
  $geoResponse = @file_get_contents("http://ip-api.com/json/{$ip}?fields=status,country,countryCode");
  if ($geoResponse) {
      $geoData = json_decode($geoResponse, true);
      if ($geoData['status'] === 'success') {
          $country = " ({$geoData['countryCode']} {$geoData['country']})";
      }
  }

  if ($formType === 'express-landing') {
    $name = $_POST['name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $telegram = $_POST['telegram'] ?? '';
    $totalPrice = $_POST['total_price'] ?? '0 ₽';
    $header = isset($_POST['header']) && $_POST['header'] === '1' ? 'Да' : 'Нет';
    $headerName = $_POST['header_name'] ?? '';
    $footer = isset($_POST['footer']) && $_POST['footer'] === '1' ? 'Да' : 'Нет';
    $footerName = $_POST['footer_name'] ?? '';
    $blocks = json_decode($_POST['blocks'] ?? '[]', true);
    $version = $_POST['version'] ?? '';
    $additionalServices = json_decode($_POST['additional_services'] ?? '[]', true);

    $versionText = '';
    if ($version === 'desktop') {
      $versionText = 'Десктоп версия';
    } elseif ($version === 'mobile') {
      $versionText = 'Мобильная версия';
    } elseif ($version === 'both') {
      $versionText = 'Обе версии (+5к)';
    }

    $text = "🎨 <b>Новая заявка: Экспресс лендинг</b>\n\n";
    $text .= "💰 <b>Итого:</b> $totalPrice\n\n";
    
    $text .= "📋 <b>Этап 1: Блоки сайта</b>\n";
    $text .= "Хедер: $header";
    if (!empty($headerName)) {
      $text .= " ($headerName)";
    }
    $text .= "\n";
    
    if (!empty($blocks)) {
      $baseBlocks = array_filter($blocks, function($b) { return !$b['isAdditional']; });
      $additionalBlocks = array_filter($blocks, function($b) { return $b['isAdditional']; });
      
      if (!empty($baseBlocks)) {
        $text .= "\n<b>Основные блоки:</b>\n";
        foreach ($baseBlocks as $block) {
          $text .= "• Блок {$block['number']}";
          if (!empty($block['type'])) {
            $text .= " [{$block['type']}]";
          }
          if (!empty($block['description'])) {
            $text .= ": {$block['description']}";
          }
          $text .= "\n";
        }
      }
      
      if (!empty($additionalBlocks)) {
        $text .= "\n<b>Дополнительные блоки:</b>\n";
        foreach ($additionalBlocks as $block) {
          $text .= "• Доп. блок {$block['number']}";
          if (!empty($block['type'])) {
            $text .= " [{$block['type']}]";
          }
          if (!empty($block['description'])) {
            $text .= ": {$block['description']}";
          }
          $text .= "\n";
        }
      }
    }
    
    $text .= "\nФутер: $footer";
    if (!empty($footerName)) {
      $text .= " ($footerName)";
    }
    $text .= "\n";
    
    $text .= "\n📦 <b>Этап 2: Дополнительные услуги</b>\n";
    $text .= "Версия сайта: $versionText\n";
    
    if (!empty($additionalServices)) {
      $text .= "\n<b>Выбранные услуги:</b>\n";
      foreach ($additionalServices as $service) {
        $text .= "• {$service['name']}";
        if (!empty($service['value'])) {
          if ($service['name'] === 'Особые пожелания (оплачивается отдельно)') {
            $text .= ":\n  {$service['value']}";
          } else {
            $valueParts = explode(' ', $service['value'], 2);
            $price = $valueParts[0];
            $period = isset($valueParts[1]) ? ' ' . $valueParts[1] : '';
            if (is_numeric($price)) {
              $priceFormatted = number_format((int)$price, 0, '', ' ');
              $text .= ": +{$priceFormatted}₽{$period}";
            } else {
              $text .= ": +{$service['value']}";
            }
          }
        }
        $text .= "\n";
      }
    }
    
    $text .= "\n👤 <b>Этап 3: Контакты</b>\n";
    $text .= "Имя: $name\n";
    $text .= "Телефон: $phone\n";
    if (!empty($telegram)) {
      $text .= "Telegram: $telegram\n";
    }
    
    $text .= "\n🌍 IP: $ip$country\n";
    $text .= "🕒 Время: " . date("Y-m-d H:i:s");
  } else {
    $name = $_POST['name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $telegram = $_POST['telegram'] ?? '';
    $service = $_POST['service'] ?? '';

    $text = "📩 <b>Новая заявка с сайта:</b>\n";
    $text .= "👤 Имя: $name\n";
    $text .= "📞 Телефон: $phone\n";
    if (!empty($telegram)) {
      $text .= "💬 Telegram: $telegram\n";
    }
    $text .= "⚙️ Услуга: $service\n";
    $text .= "🌍 IP: $ip$country\n";
    $text .= "🕒 Время: " . date("Y-m-d H:i:s");
  }

  $sendUrl = "https://api.telegram.org/bot{$botToken}/sendMessage?";
  $params = http_build_query([
    'parse_mode' => 'HTML',
    'chat_id' => $chatId,
    'text' => $text,
  ]);
  $response = file_get_contents($sendUrl . $params);

  if ($response) {
    echo json_encode(['ok' => true, 'message' => '✅ Заявка отправлена!']);
  } else {
    echo json_encode(['ok' => false, 'message' => '❌ Ошибка отправки']);
  }
?>
