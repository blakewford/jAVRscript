  var nokiaScreen = target == "atmega328";
  screen_driver.setAttribute("type", "text/javascript");
  screen_driver.setAttribute("src", nokiaScreen ? "js/nokia_spi_driver.js": "js/tft_spi_driver.js");
  layout.appendChild(screen_driver);
  screen_buffer.width = nokiaScreen ? 84: 160;
  screen_buffer.height = nokiaScreen ? 48: 128;
  var scale = width/screen_buffer.width;

  function normalize(value, align)
  {
    var normal_value = Math.floor(value);
    return normal_value % align === 0 ? normal_value: normal_value - (normal_value % align);
  }

  function initScreen()
  {
      screen_canvas.width = width;
      screen_canvas.height = scale*screen_buffer.height;
      return screen_canvas.height;
  }

  function initPort(port_id, port_height)
  {
      var pin = document.getElementById(port_id);
      pin.width = normalize(width/port_width, port_width)-1;
      var device_width = (pin.width*port_width) + port_width;
      if(device_width < width)
      {
          pin.width += normalize((width-device_width)/port_width, 2);
      }
      pin.height = port_height;
      fillCanvas(pin, default_color);
  }

  function initLastPin(port_id, port_height)
  {
     initPort(port_id, port_height);
     var pin = document.getElementById(port_id);
     var device_width = (pin.width*port_width)+port_width;
     pin.width += width-device_width;
  }

  function initPorts(port_height)
  {
     initPort("B0",port_height);
     initPort("B1",port_height);
     initPort("B2",port_height);
     initPort("B3",port_height);
     initPort("B4",port_height);
     initPort("B5",port_height);
     initPort("B6",port_height);
     initLastPin("B7",port_height);

     initPort("C0",port_height);
     initPort("C1",port_height);
     initPort("C2",port_height);
     initPort("C3",port_height);
     initPort("C4",port_height);
     initPort("C5",port_height);
     initPort("C6",port_height);
     initLastPin("C7",port_height);

     initPort("D0",port_height);
     initPort("D1",port_height);
     initPort("D2",port_height);
     initPort("D3",port_height);
     initPort("D4",port_height);
     initPort("D5",port_height);
     initPort("D6",port_height);
     initLastPin("D7",port_height);

     initPort("E0",port_height);
     initPort("E1",port_height);
     initPort("E2",port_height);
     initPort("E3",port_height);
     initPort("E4",port_height);
     initPort("E5",port_height);
     initPort("E6",port_height);
     initLastPin("E7",port_height);

     initPort("F0",port_height);
     initPort("F1",port_height);
     initPort("F2",port_height);
     initPort("F3",port_height);
     initPort("F4",port_height);
     initPort("F5",port_height);
     initPort("F6",port_height);
     initLastPin("F7",port_height);
  }

  function initFileInput()
  {
      file_input.addEventListener('change', function(evt)
      {
        var file = file_input.files[0];
        if(!file)
        {
          alert('Intel Hex File Required');
          return;
        }
        var reader = new FileReader();
        reader.onloadend = function(evt)
        {
          if(evt.target.readyState == FileReader.DONE)
          {
            var bytes = evt.target.result;
            if( bytes.charCodeAt(0) == 0x7f && bytes[1] == 'E' && bytes[2] == 'L' && bytes[3] == 'F' )
            {
              intelhex = getHexFromElf(bytes);
              buildFrameInfo();
              buildLineInfo();
            }else{
              intelhex = evt.target.result;
            }
            loadMemory(intelhex);
            engineInit();
            exec();
          }
        };
        reader.readAsBinaryString(file.slice(0, file.size));
      }, false);
  }

  function fillCanvas(canvas, color)
  {
      var context = canvas.getContext('2d');
      switch(color)
      {
          case "red":
              color = "#FF0000";
              break;
          case "green":
              color = "#00FF00";
              break;
          case "black":
              color = "#000000";
              break;
      }
      var imgData = context.getImageData(0,0,canvas.width,canvas.height);
      var cursor = canvas.width*canvas.height*4;
      while((cursor-=4))
      {
        imgData.data[cursor]   = parseInt(color.substr(1,2),16);
        imgData.data[cursor+1] = parseInt(color.substr(3,2),16);
        imgData.data[cursor+2] = parseInt(color.substr(5),16);
        imgData.data[cursor+3] = 0xFF;
      }
      imgData.data[cursor]   = parseInt(color.substr(1,2),16);
      imgData.data[cursor+1] = parseInt(color.substr(3,2),16);
      imgData.data[cursor+2] = parseInt(color.substr(5),16);
      imgData.data[cursor+3] = 0xFF;
      context.putImageData(imgData, 0, 0);
  }

  function refreshScreen()
  {
      var context = screen_canvas.getContext('2d');
      context.scale(scale,scale);
      context.drawImage(screen_buffer, 0, 0);
      context.scale(1/scale,1/scale);
  }

  function pinNumberToPinObject(pin_number)
  {
    var pin = null;
    switch(pin_number)
    {
      case 0:
        pin = B0;
        break;
      case 1:
        pin = B1;
        break;
      case 2:
        pin = B2;
        break;
      case 3:
        pin = B3;
        break;
      case 4:
        pin = B4;
        break;
      case 5:
        pin = B5;
        break;
      case 6:
        pin = B6;
        break;
      case 7:
        pin = B7;
        break;
      case 8:
        pin = C0;
        break;
      case 9:
        pin = C1;
        break;
      case 10:
        pin = C2;
        break;
      case 11:
        pin = C3;
        break;
      case 12:
        pin = C4;
        break;
      case 13:
        pin = C5;
        break;
      case 14:
        pin = C6;
        break;
      case 15:
        pin = C7;
        break;
      case 16:
        pin = D0;
        break;
      case 17:
        pin = D1;
        break;
      case 18:
        pin = D2;
        break;
      case 19:
        pin = D3;
        break;
      case 20:
        pin = D4;
        break;
      case 21:
        pin = D5;
        break;
      case 22:
        pin = D6;
        break;
      case 23:
        pin = D7;
        break;
      case 26:
        pin = E6;
        break;
      case 30:
        pin = E7;
        break;
      case 32:
        pin = F0;
        break;
      case 33:
        pin = F1;
        break;
      case 36:
        pin = F4;
        break;
      case 37:
        pin = F5;
        break;
      case 38:
        pin = F6;
        break;
      case 39:
        pin = F7;
        break;
    }

    return pin;
  }

  function popPortBuffer(queue, port)
  {
      if(!optimizationEnabled && !(forceOptimizationEnabled && (port == spipinport1*8 || port == spipinport2*8)))
      {
        var pin = null;
        // Disable all port pins
        for(i = 0; i < bitsPerPort; i++)
        {
          pin = pinNumberToPinObject(parseInt(i + port));
          if(pin)
          {
            //IsGreen?
            var data = pin.getContext('2d').getImageData(0, 0, 1, 1).data[1];
            if(data == 0xFF)
            {
              fillCanvas(pin, red_color);
            }
          }
        }
        queue = queue.shift();
        // Enable selected port pins
        for(i = 0; i < bitsPerPort; i++)
        {
           if(parseInt(queue) & 1 << i)
           {
             pin = pinNumberToPinObject(parseInt(i + port));
             if(pin)
             {
               fillCanvas(pin, green_color);
             }
           }
        }
      }
      else{
          queue.shift();
      }
  }

  function uartWrite(data)
  {
      uart.value.length == uartBufferLength - 1 && (uart.value = "");
      uart.value += String.fromCharCode(data);
  }

  function drawPixel(x, y, color)
  {
      if( x > screen_buffer.width-1 || y > screen_buffer.height-1 )
      {
        return;
      }
      var context = screen_buffer.getContext('2d');
      var imgData = context.getImageData(x,y,1,1);
      imgData.data[0] = parseInt(color.substr(1,2),16);
      imgData.data[1] = parseInt(color.substr(3,2),16);
      imgData.data[2] = parseInt(color.substr(5),16);
      imgData.data[3] = 0xFF;
      context.putImageData(imgData, x, y);
  }

  function fillScreen(color)
  {
      for(var y = 0; y < screen_buffer.height; y++)
      {
        for(var x = 0; x < screen_buffer.width; x++)
        {
          drawPixel( x, y, color );
        }
      }
  }

  function handleBreakpoint(address)
  {
      var index = softBreakpoints.indexOf(parseInt(address, 16)-flashStart+2);
      if(index >= 0)
      {
        alert("Breakpoint at 0x" + softBreakpoints[index].toString(16));
      }
  }

  function filterRelevantKeypress()
  {
      switch(event.which)
      {
        case 13:
            doDebugCommand();
            break;
        case 38:
            gdb_window.value = historyIndex >= 0 ?
            commandHistory[historyIndex--]: "";
            break;
      }
  }

  function doDebugCommand()
  {
      var command = gdb_window.value;
      commandHistory.push(command);
      historyIndex = commandHistory.length-1;
      handleDebugCommandString(command);
      gdb_window.value = "";
      gdb_window.focus();
  }

  function setDebugResult(result)
  {
      result_window.textContent = result;
  }