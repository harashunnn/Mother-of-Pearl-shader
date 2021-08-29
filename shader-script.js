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
    light_position:{
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
      uniform vec3 light_position;
      uniform vec3 camera_position;
      varying vec3 normal_vector;
      varying vec3 camera_vector;
      varying vec3 light_vector;

      void main() {
        normal_vector = position;
        camera_vector = position - camera_position;
        light_vector = light_position;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
      `,
    fragmentShader:
      `

      uniform float time;
      varying vec3 light_vector;
      varying vec3 normal_vector;
      varying vec3 camera_vector;

      float cal_angle(in vec3 a,in vec3 b){
        return acos( (dot(a,b))/(length(a)*length(b)));
      }

      vec3 cal_RGB(in float ST,in float SR,in float SI,in float t,in float r,in float a,in float In){
        float T = ST*cos(t);
        float R = SR*cos(r);
        float I = SI*pow((1.0-cos(a)),In);
        return vec3(T,R,I);
      }

      void main(){
        vec3 Normal_vector = normalize(normal_vector);
        vec3 Light_vector = normalize(light_vector);
        vec3 Vision_vector = normalize(camera_vector);
        vec3 half_vector = normalize(Vision_vector+Light_vector);

        vec3 LV_Normal_vector = cross(Light_vector,Vision_vector);
        vec3 Project_N = Normal_vector - ((dot(LV_Normal_vector,Normal_vector)/(pow(length(LV_Normal_vector),2.0)))*LV_Normal_vector);
        float angle_of_incidence = cal_angle(Project_N,Light_vector) - 0.5*3.145;
        float aori_angle = cal_angle(Project_N,Normal_vector) - 0.5*3.145;
        float acceptance_angle = cal_angle(Project_N,Vision_vector)-3.145;

        vec3 rgb = cal_RGB(0.4,0.25,0.25,aori_angle,acceptance_angle,angle_of_incidence,1.5);
        float lambertTerm = pow(dot(Normal_vector,Light_vector),4.0);
        
        vec3 R = (2.0*Normal_vector*dot(Light_vector,Normal_vector)) - Light_vector;
        float I = 0.0;
        if (dot(Light_vector,Normal_vector) > 0.0){
          I = 0.5*pow(dot(R,Vision_vector),20.0);
        }

        
        vec4 vvColor = vec4(vec3(lambertTerm*rgb)+vec3(I),1.0);
        gl_FragColor = vec4(vvColor);
      }
      `
  });

  