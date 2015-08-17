Routes & Structure

site://slug/slug/slug

api/{module}/{entity}/{operation}/{token}/{object}/{start}/{limit}/{query}/{sort[]}
auth/{operation}/{token}
screen/{module}/{entity}/{operation}/{token}/{object}

-------------------------------------------------------------------------------

app
  |- src
      |- {module}
        |- view
          |- {entity}.{pt-br}.xml
          |- {entity}.{operation}.toolbar.html
          |- {entity}.{operation}.view.html
        |- controller
          |- {entity}.ctrl.php
        |- model
          |- {entity}.class.php