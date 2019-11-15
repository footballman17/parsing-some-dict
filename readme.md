<p align="center"><img src="https://www.sayidaty.net/sites/default/files/2018/12/19/4698516-1010955051.png" width="200"></p>

Парсер online-переводчиков
=============================

### Задача

Создать парсер online-переводчиков:
- [Яндекс Переводчик](https://translate.yandex.ru/) — режим словаря;
- [Яндекс Переводчик](https://translate.yandex.ru/) — режим обычного перевода текста;
- [wooordhunt.ru](https://wooordhunt.ru/)

**Входные данные**

Файл с текстом или списком слов для перевода.

**Выходные данные**

Файл с переведенным текстом.

### Решение

- Поставленная задача решалась с помощью [Node.js](https://nodejs.org/)

- Для выполнения запросов использовалась библиотека [axios](https://github.com/axios/axios)

- Для разбора html-содержимого библиотека [cheerio](https://github.com/cheeriojs/cheerio) и [jquery](https://github.com/cheeriojs/cheerio)

- Для выполнения асинхронного применялись *async*, *await* и *Promise*

- Для обработки возможных ошибок созданы собственные обработчики ошибок, унаследованные от стандартного класса **Error**:

| Имя ошибки   | Описание      |
| ------------- |:-------------|
| ClearFileError      | Ошибка при очистке файла |
| IncorrectPathError      | Неправильный путь к файлу |
| UnknownParserError | Неизвестный тип парсера |
| VoidSourceDataError | Пустой файл для перевода |
| VoidStringError | Пустая строка для перевода|
| WooordhuntApiError | Ошибка от сервера wooordhunt.ru|
| YandexApiError | Ошибка от сервера Яндекса |