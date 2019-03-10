document.addEventListener(
    "keydown",
    event => {
        code = event.keyCode;
        console.log(code);
        if(code == 39){
            player.pos[0] += 6;
        }
        if(code == 37){
            player.pos[0] -= 6;
        }
        if(code == 38 && in_gravity == -1){
            if(in_jump == -1){
                player.pos[1] += player.jump;
                in_jump = 1;
            }
        }
        if(code == 71){
            const canvas = document.querySelector('#glcanvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            console.log("Grayscale");
            const fsSource = `
            #ifdef GL_ES
            precision mediump float;
            #endif
            
            varying highp vec2 vTextureCoord;
            varying highp vec3 vLighting;
            uniform sampler2D uSampler;
            void main(void) {
              highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
              
              vec3 color = texelColor.rgb;
              float gray = (color.r + color.g + color.b) / 3.0;
              vec3 grayscale = vec3(gray);
              gl_FragColor = vec4(grayscale , texelColor.a);
            }
          `;          
          const vsSource = `
          attribute vec4 aVertexPosition;
          attribute vec3 aVertexNormal;
          attribute vec2 aTextureCoord;
      
          uniform mat4 uNormalMatrix;
          uniform mat4 uModelViewMatrix;
          uniform mat4 uProjectionMatrix;
      
          varying highp vec2 vTextureCoord;
          varying highp vec3 vLighting;
      
          void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;
      
            // Apply lighting effect
      
            highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            highp vec3 directionalLightColor = vec3(1, 1, 1);
            highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      
            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      
            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
          }
        `;
         const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
            
           programInfo = {
            program: shaderProgram,
            attribLocations: {
              vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
              vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
              textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            },
            uniformLocations: {
              projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
              modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
              normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
              uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            },
          };
                }
        if(code == 72){
            const canvas = document.querySelector('#glcanvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            console.log("Grayscale");
            const vsSource = `
            attribute vec4 aVertexPosition;
            attribute vec3 aVertexNormal;
            attribute vec2 aTextureCoord;
        
            uniform mat4 uNormalMatrix;
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
        
            varying highp vec2 vTextureCoord;
            varying highp vec3 vLighting;
        
            void main(void) {
              gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
              vTextureCoord = aTextureCoord;
        
              // Apply lighting effect
        
              highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
              highp vec3 directionalLightColor = vec3(1, 1, 1);
              highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
        
              highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
        
              highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
              vLighting = ambientLight + (directionalLightColor * directional);
            }
          `;
        
          // Fragment shader program
          const fsSource = `
            varying highp vec2 vTextureCoord;
            varying highp vec3 vLighting;
        
            uniform sampler2D uSampler;
        
            void main(void) {
              highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
        
              gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
            }
          `;
           const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
           programInfo = {
            program: shaderProgram,
            attribLocations: {
              vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
              vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
              textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            },
            uniformLocations: {
              projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
              modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
              normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
              uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            },
          };
                }
    },
    false
);
    