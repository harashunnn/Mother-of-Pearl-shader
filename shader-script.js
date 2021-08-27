let uniforms = {
    time:{
        type:'f',value:0.1
    },
    resolution:{
        type:'v2',value:new THREE.Vector2()
    },
    mouse:{
        type:'v2',value:new THREE.Vector2()
    },
    light_vector:{
        type:'v3',value:new THREE.Vector3()
    },
    camera_position:{
        type:'v3',value:new THREE.Vector3()
    }
};


const raden_shader = new THREE.ShaderMaterial({
    uniforms:uniforms,
    vertexShader:
      `
      uniform vec3 camera_position;
      varying vec3 normal_vector;
      varying vec3 camera_vector;

      void main() {
        normal_vector = position;
        camera_vector = position - camera_position;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
      `,
    fragmentShader:
      `

      uniform float time;
      uniform vec3 light_vector;
      varying vec3 normal_vector;
      varying vec3 camera_vector;

      void main(){
        vec3 N = normalize(normal_vector);
        vec3 L = normalize(light_vector);
        vec3 V = normalize(camera_vector);

        
        float lambertTerm = dot(L,N);
        vec4 vvColor = vec4(lambertTerm*vec3(1.0,1.0,1.0),1.0);
        gl_FragColor = vec4(vvColor);
      }
      `
  });

  