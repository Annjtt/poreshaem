/**
 * Простой ответ на GET-запрос, чтобы при открытии URL в браузере не было ошибки.
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Web-приложение бота активно. Используйте POST с формы сайта.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Основной endpoint для формы (POST запрос с сайта).
 * Ожидает данные в формате form-urlencoded (FormData в браузере).
 */
function doPost(e) {
  var response = createResponse_(200, { status: 'error', message: 'Unknown error' });

  try {
    if (!e || !e.parameter) {
      return createResponse_(400, { status: 'error', message: 'Нет данных в запросе' });
    }

    var params = e.parameter;

    // Honeypot-защита: поле, которое человек не видит, но бот может заполнить.
    if (params.website && params.website.trim() !== '') {
      // Молча считаем это спамом и возвращаем "успех", чтобы не подсказывать спамеру.
      return createResponse_(200, { status: 'ok', message: 'Заявка принята' });
    }

    var name = (params.name || '').trim();
    var phone = (params.phone || '').trim();
    var age = (params.age || '').trim();
    var message = (params.message || '').trim();

    if (!name || !phone || !age) {
      return createResponse_(400, {
        status: 'error',
        message: 'Пожалуйста, заполните все обязательные поля'
      });
    }

    // Получаем секреты из Properties, чтобы не светить в коде
    var props = PropertiesService.getScriptProperties();
    var botToken = props.getProperty('TELEGRAM_BOT_TOKEN');
    var chatId = props.getProperty('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      return createResponse_(500, {
        status: 'error',
        message: 'Секреты бота не настроены. Обратитесь к администратору.'
      });
    }

    // Красивое оформление сообщения
    var now = new Date();
    var formattedTime = Utilities.formatDate(now, 'Asia/Vladivostok', 'dd.MM.yyyy HH:mm');

    // Делаем телефон кликабельным (tel:+7...) в Telegram
    var rawPhoneDigits = phone.replace(/\D/g, '');
    if (rawPhoneDigits.length > 0) {
      if (rawPhoneDigits.charAt(0) === '8') {
        rawPhoneDigits = '7' + rawPhoneDigits.substring(1);
      } else if (rawPhoneDigits.charAt(0) !== '7') {
        rawPhoneDigits = '7' + rawPhoneDigits;
      }
    }
    var telHref = rawPhoneDigits ? '+'.concat(rawPhoneDigits) : escapeHtml_(phone);
    var phoneDisplay = escapeHtml_(phone);

    var textLines = [
      '✨ <b>Новая заявка с сайта «ПОРЕШАЕМ»</b>',
      '━━━━━━━━━━━━━━━━━━━━',
      '👤 <b>Родитель:</b> ' + escapeHtml_(name),
      '📞 <b>Телефон:</b> <a href="tel:' + telHref + '">' + phoneDisplay + '</a>',
      '👶 <b>Возраст ребёнка:</b> ' + escapeHtml_(age)
    ];

    if (message) {
      textLines.push('');
      textLines.push('📝 <b>Комментарий:</b>');
      textLines.push(escapeHtml_(message));
    }

    textLines.push('');
    textLines.push('⏰ <b>Время заявки:</b> ' + formattedTime + ' (Владивосток)');

    var text = textLines.join('\n');

    // Отправка сообщения в Telegram
    var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
    var payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var telegramResponse = UrlFetchApp.fetch(url, options);
    var code = telegramResponse.getResponseCode();

    if (code < 200 || code >= 300) {
      return createResponse_(500, {
        status: 'error',
        message: 'Не удалось отправить сообщение в Telegram'
      });
    }

    return createResponse_(200, {
      status: 'ok',
      message: 'Заявка успешно отправлена'
    });
  } catch (err) {
    return createResponse_(500, {
      status: 'error',
      message: 'Внутренняя ошибка сервера'
    });
  }
}

/**
 * Обёртка для стандартизированного ответа + CORS.
 */
function createResponse_(statusCode, obj) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);

  var response = output;
  // В Apps Script CORS заголовки задаются через HtmlService, но для простого POST
  // с FormData CORS-проблем, как правило, нет. Оставляем базовый JSON-ответ.
  return response;
}

/**
 * Экранирование HTML в пользовательском вводе.
 */
function escapeHtml_(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


