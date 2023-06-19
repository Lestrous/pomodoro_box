export const indexTemplate = (content) => `
  <!DOCTYPE html>
  <html lang="ru">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>pomodoro_box</title>
    <script defer src="/static/client.js"></script>
  </head>

  <body class="page">
    <div id="react_root">${content}</div>
    <div id="modal_root"></div>
    <div id="dropdown_root"></div>
  </body>

  </html>
`;
