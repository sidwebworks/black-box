const Preview: React.FC = () => {
  return (
    <div className={"preview-wrapper h-full"}>
      <iframe
        title="preview"
        className="h-full"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default Preview;

const _html = `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style id="_style"></style>
</head>

<body>
    <div id="root"></div>
</body>

<script type="module">

const _log = console.log

const types = ['log', 'debug', 'info', 'warn', 'error', 'table', 'clear', 'time', 'timeEnd', 'count' , 'assert']

function proxy(context, method, message) { 
    return function() {
        window.parent.postMessage({type: "console", method: method.name, data: JSON.stringify(Array.prototype.slice.apply(arguments))}, '*');
    }
  }

  types.forEach(el =>  {
    window.console[el] = proxy(console, console[el], el)
  })

function setHtml(html) {
    document.body.innerHTML = html
}

  function executeJs(javascript) {
    try {
        eval(javascript)
    } catch (err) {
        console.error(err.message)
    }
}

  function setCss(css) {
    const style = document.getElementById('_style')
    const newStyle = document.createElement('style')
    newStyle.id = '_style'
    newStyle.innerHTML = typeof css === 'undefined' ? '' : css
    style.parentNode.replaceChild(newStyle, style)
  }

  window.addEventListener(
    "error",
    (event) => {
       console.error(event.error)
    },
    false
);

    window.addEventListener(
        "message",
        (e) => {
            if (typeof e.data.html !== 'undefined'){
                setHtml(e.data.html)
            }

           if (typeof e.data.javascript !== 'undefined'){
             executeJs(e.data.javascript)
           } 

           if (typeof e.data.css !== 'undefined'){
            setCss(e.data.css)
           } 
        },
        false
    );
    </script> 

</html>
`;
