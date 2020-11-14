
///****Capa Entidades 

let comando = ""

let menu = [
    {accion: "Preparar 1 taza", tecla: "1"},
    {accion: "Preparar 2 taza", tecla: "2"},
    {accion: "Llenar Water Tank", tecla: "W"},  
    {accion: "Llenar Cofee Grinder", tecla: "G"},  
    {accion: "Apagar", tecla: "P"}

  ]


let brewer = {
      cafePreparado:0,
      encendido:false,
      sensorCafeMolido:0,
      valvulaCafePreradaAbierta:false,
      extraerCafeMolino:function(cafeMolido){
        this.encendido = true
        while(cafeMolido > 0){
          cafeMolido---
          this.sensorCafeMolido++
        }
        this.encendido = false
        return this.sensorCafeMolido
      },
      mezclarCafeConAgua:function(agua){
        this.encendido = true
        while(agua > 0){
          agua--
          this.cafePreparado ++
        }
        this.encendido = false
        return this.cafePreparado
      },

      vaciarCafeEnVaso:function(tazas){
        if(this.cafePreparado >= tazas){
          while(tazas > 0){
            tazas--
            this.cafePreparado--
          }
          return this.cafePreparado
        }

        return false
      }
    }


let cofeeGrinder = {
      motorEncendido: false,
      moliendoCafe: false,
      sensorPeso:0,
      pesoMaximo:100,
      vascula:function(peso){
        this.sensorPeso = peso
        return this.sensorPeso
      },
      obtnerPesoActual: function(){
        if(this.sensorPeso === 0){
          return "0%"
        }else{
          return this.sensorPeso+"%";
        }
      },
      molerCafe:function(tazas){
        this.motorEncendido = true
        if(this.sensorPeso >= tazas){
          while(this.sensorPeso > tazas){
            this.moliendoCafe = true
            this.sensorPeso--
            
          }
          this.motorEncendido = false
          return this.sensorPeso
        }

        this.motorEncendido = false
        return "Debe estar lleno al 50%" 

      }
    }


let waterTank = {
      sensorTempAgua:0,
      tempMaxima:100,
      sensorNivelAgua:0,
      nivelMaximo:100,
      valvulaAguaFriaAbierta: false,


      calentarAgua:function(){
          if(this.sensorTempAgua === 0){
            while(this.sensorTempAgua < this.tempMaxima){
              this.sensorTempAgua++
              console.log("Calentanto %"+this.sensorTempAgua)
              
            }
            return this.sensorTempAgua
          }

          return this.sensorTempAgua
      },

      obtenerTemperaturaAgua:function(){
        if(this.sensorTempAgua == 0){
          return "0°"
        }
        return this.sensorTempAgua
      },


      llenarTanque:function(){
        if(this.sensorNivelAgua === 0){
          this.valvulaAguaFriaAbierta = true

          while(this.sensorNivelAgua < this.nivelMaximo){
            this.sensorNivelAgua++
            console.log("Llenando %"+this.sensorNivelAgua)
          }
          
          
          this.valvulaAguaFriaAbierta = false
          
          return this.sensorNivelAgua
          
        }
          
          return this.sensorNivelAgua

      },

      
      obtenerNivelTanque:function(){
        if(this.sensorNivelAgua === 0){
          return "Vacio"
        }
        
        return "%"+this.sensorNivelAgua
      },

      abrirValvulaAguaCaliente:function(){
        return this.sensorNivelAgua
        
      }
    }



let maquinaEspresso = {
    marca: "NessPresso",
    fecha: new Date(),
    encendida: false,
    cantidadTasas:0,
    botonPower: function(){
      if(this.encendida === false){
        this.encendida = true 
      }else{
        this.encendida = false 
      }
      
      return this.encendida
    
    },
    brewer:brewer,
    cofeeGrinder:cofeeGrinder,
    waterTank:waterTank,
    
}





let sensores = {
  agua: waterTank.obtenerNivelTanque(),
  grinder: cofeeGrinder.obtnerPesoActual(),
  temperaturaAgua: waterTank.obtenerTemperaturaAgua(),
  
}
  


// Capa de Logica de la Maquina

  function encenderMaquina(){
    let btnPower = confirm("Encer la maquina?")
    if (btnPower === true) {
        maquinaEspresso.botonPower()
    } 
    return false
  }
  
  function mostrarMenu() {
    console.clear()
    console.log("***** "+maquinaEspresso.marca+"*****") 
    console.log(""+maquinaEspresso.fecha)
    console.log("***** SENSORES *****")    
    console.table(sensores)
    console.log("***** MENU *****")
    console.table(menu)
      
  }


  function hacerDosTazas(){
    let errores = []
    //verificar si hay cafe en el grinder
    if(cofeeGrinder.sensorPeso < 100){
      errores.push('Cafe en el grinder')
    }
    //Verificar si hay agua en el tanque
    if(waterTank.sensorNivelAgua < 100){
      errores.push('Agua en el tanque')
    }
    
    
    if(errores.length === 0){
      

    //Establecemos la medida
    let dosTazas = 100
    //comenzamos proceso de molido

    cofeeGrinder.molerCafe()

    let cafeMolido = brewer.extraerCafeMolino(dosTazas)

    //Extraemos el agua caliente con la medida seleccionada
    let aguaCaliente = waterTank.abrirValvulaAguaCaliente(dosTazas)
    //Actualizamos sensores
    waterTank.sensorNivelAgua = 0
    sensores.agua = waterTank.obtenerNivelTanque()
    cofeeGrinder.sensorPeso = 0;
    sensores.grinder = cofeeGrinder.obtnerPesoActual()
    waterTank.sensorTempAgua = 0;
    sensores.temperaturaAgua = waterTank.obtenerTemperaturaAgua()
    //Preparamos el cafe
    let cafePreparado = brewer.mezclarCafeConAgua(aguaCaliente,cafeMolido)
    
    if(cafePreparado === false){
      return error(["Insuficiente Cafe Preparado"])
    }

    prompt("Primera taza: Coloque un vaso y presione enter")
    brewer.vaciarCafeEnVaso(dosTazas/2)
    
    prompt("Primera taza: Coloque un vaso y presione enter")

    brewer.vaciarCafeEnVaso(dosTazas/2)
    }else{
      error(errores)
    }

  }

  function hacerUnaTaza(){
    let errores = []
    //verificar si hay cafe en el grinder
    if(cofeeGrinder.sensorPeso < 50){
      errores.push('Cafe en el grinder')
    }
    //Verificar si hay agua en el tanque
    if(waterTank.sensorNivelAgua < 50){
      errores.push('Agua en el tanque')
    }
    
    
    if(errores.length === 0){
      

    //Establecemos la medida
    let unaTazas = 50
    //comenzamos proceso de molido

    let cafeRestante = cofeeGrinder.molerCafe(unaTazas)
      console.log(cafeRestante)
    let cafeMolido = brewer.extraerCafeMolino(unaTazas)

    //Extraemos el agua caliente con la medida seleccionada
    let aguaCaliente = waterTank.abrirValvulaAguaCaliente(unaTazas)
    //Actualizamos sensores
    waterTank.sensorNivelAgua = waterTank.sensorNivelAgua - unaTazas
    sensores.agua = waterTank.obtenerNivelTanque()
    cofeeGrinder.sensorPeso = cafeRestante
    sensores.grinder = cofeeGrinder.obtnerPesoActual()
    waterTank.sensorTempAgua = waterTank.sensorTempAgua - unaTazas
    sensores.temperaturaAgua = waterTank.obtenerTemperaturaAgua()
    //Preparamos el cafe
    let cafePreparado = brewer.mezclarCafeConAgua(aguaCaliente,cafeMolido)
    
    if(cafePreparado === false){
      return error(["Insuficiente Cafe Preparado"])
    }

    prompt("Primera taza: Coloque un vaso y presione enter")
    brewer.vaciarCafeEnVaso(unaTazas)
    
    }else{
      error(errores)
    }

  }

  function error(errores){
      
      console.clear()
      console.log("***********VERIFIQUE**************")
      errores.forEach(x => {
        console.log("- "+x)
      });
      console.log("**********************************")
      prompt("Presione enter para continuar")
      
  }

  function llenarGrinder(){
    
    let peso = prompt("Escriba peso en rango 50-100")

    if(peso > cofeeGrinder.pesoMaximo ){
      error(['Sobrepasa el peso maximo'])
      
      peso = 0
    
    }
    sensores.grinder = cofeeGrinder.vascula(peso)+"%"

  }

  function calentarAgua(){
    sensores.temperaturaAgua = waterTank.calentarAgua()+"°"
  }

  function llenarWaterTank(){
    
    sensores.agua = waterTank.llenarTanque()+"%"
  }

  function apagarMaquina(){
    maquinaEspresso.botonPower()
    console.clear()
    console.log("---- Bye -----")
  }



// Capa UI
encenderMaquina()

  while(maquinaEspresso.encendida === true){

    mostrarMenu()
    
    comando = prompt("Escriba la letra y precione enter")
    
    switch (comando) {
      case "1":
        hacerUnaTaza()
        
        break;
        case "2":
            hacerDosTazas()
            
            break;
        case "p":
            apagarMaquina()
            
            break;
        case "w":
            llenarWaterTank()
            calentarAgua()
            break;
        case "g":
            llenarGrinder()
            break;

        default:
            break;
    }
    
  }