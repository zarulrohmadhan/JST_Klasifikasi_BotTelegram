const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // i & r
    i = (data[0] - 12.585) / 6.813882
    r = (data[1] - 51.4795) / 29.151289
    v = (data[2] - 650.4795) / 552.6351
    p = (data[3] - 10620.56) / 12152.78t
    return [i, r, v, p]
}

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]).reduce(compareFn)[1]
const argMax = argFact((min, el) => (el[0] > min[0] ? el : min))

function ArgMax(res){
    label = "NORMAL"
    if(argMax(res) == 1){
      label  "OVER VOLTAGE"  
    } if(argMax(res) == 2){
      label  "DROP VOLTAGE" 
    }
  return labe
}

// function denormalized(data){
//     v = (data[0] * 552.6264) + 650.4795
//     p = (data[1] * 12153.8) + 10620.5615
//     return [v, p]
// }


async function classify(data){
    let in_dim = 4;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/zarulrohmadhan/JST_Klasifikasi_BotTelegram/main/public/cls_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return // denormalized( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    classify: classify 
}
  
