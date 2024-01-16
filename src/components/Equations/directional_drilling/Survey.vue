<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Error Handling
const errMsg = ref('')

// Data
const method = ref('angle_avg')
const angle_avg_method = ref(true)
const radius_curv_method = ref(false)
const balanced_tang_method = ref(false)
const min_curv_method = ref(false)
const surveyTable = ref([
    {'depth': 0, 'inc': 0, 'azi':0, 'tvd':0, 'north':0, 'east':0},
    {'depth': '', 'inc': '', 'azi':''}
])

// Select Data

// Add and Delete Row
const addSurvey = (id) => {
    surveyTable.value.splice(id+1, 0, {
        'depth': '',
        'inc':'',
        'azi':'',
    })
}

const deleteSurvey = (id) => {
    if (surveyTable.value.length > 2) {
        surveyTable.value.splice(id,1)
    } else {
        errMsg.value == 'Atleast two survey data should be available'
        setTimeout(() => {
            errMsg.value = null
        }, 5000);
    }
}

// Calculations

/* Min Curvature Constants */
const beta = (i1, i2, a1, a2) => {
    if (i1 == i2) {
        return 1
    } else {
        return Math.acos(Math.cos((i2 - i1) * Math.PI / 180) - Math.sin(i1 * Math.PI/180) * Math.sin(i2 * Math.PI / 180) * (1 - Math.cos((a2 - a1) * Math.PI / 180)))
    }
    
}

const RF = (i1, i2, a1, a2) => {
    
    return 2 / beta(i1, i2, a1, a2) * Math.tan(beta(i1, i2, a1, a2) / 2)
}

/* TVD Calcs */

const tvdCalc = () => {
    let di = []
    let inci = []
    let azii = []
    let tvdi = []
    for (let i=0; i<=surveyTable.value.length-1; i++) {
        di.push(surveyTable.value[i].depth)
        inci.push(surveyTable.value[i].inc)
        azii.push(surveyTable.value[i].azi)
    }
    
    for (let i=0; i<=surveyTable.value.length-1; i++) {
        if (i == 0) {
            tvdi.push(0)
        } else {
            if (method.value == 'angle_avg') {
                tvdi.push(tvdi[i-1] + ((di[i]-di[i-1]) * Math.cos((inci[i] + inci[i-1]) * Math.PI / 180 / 2)))
            } else if (method.value == 'radius_curv_method') {
                if (inci[i] == inci[i-1]) {
                    tvdi.push(tvdi[i-1] + (di[i] - di[i-1]) * Math.cos(inci[i] * Math.PI / 180))
                } else {
                    tvdi.push(tvdi[i-1] + (di[i] - di[i-1]) * (Math.sin(inci[i] * Math.PI / 180) - Math.sin(inci[i-1] * Math.PI / 180)) / (inci[i] - inci[i-1]) * 180 / Math.PI)
                }
            } else if (method.value == 'balanced_tang_method') {
                tvdi.push(tvdi[i-1] + (di[i] - di[i-1]) / 2 * (Math.cos(inci[i] * Math.PI/180) + Math.cos(inci[i-1] * Math.PI/180)))
            } else {
                if (inci[i] == inci[i-1]) {
                    tvdi.push(tvdi[i-1] + (di[i] - di[i-1]) * Math.cos(inci[i] * Math.PI / 180))
                } else {
                    tvdi.push(tvdi[i-1] + (di[i] - di[i-1]) / 2 * (Math.cos(inci[i] * Math.PI / 180) + Math.cos(inci[i-1] * Math.PI / 180)) * RF(inci[i-1], inci[i], azii[i-1], azii[i]))
                }
            }
        }
    }
    return tvdi
}

const neCalc = () => {
    let di = []
    let inci = []
    let azii = []
    let ni = []
    let ei = []
    for (let i=0; i<=surveyTable.value.length-1; i++) {
        di.push(surveyTable.value[i].depth)
        inci.push(surveyTable.value[i].inc)
        azii.push(surveyTable.value[i].azi)
    }

    for (let i=0; i<=surveyTable.value.length-1; i++) {
        if (i == 0) {
            ni.push(0)
            ei.push(0)
        } else {
            if (method.value == 'angle_avg') {
                ni.push(ni[i-1] + (di[i] - di[i-1]) * Math.sin((inci[i] + inci[i-1]) / 2 * Math.PI / 180) * Math.cos((azii[i] + azii[i-1]) / 2 * Math.PI / 180))
                ei.push(ei[i-1] + (di[i] - di[i-1]) * Math.sin((inci[i] + inci[i-1]) / 2 * Math.PI / 180) * Math.sin((azii[i] + azii[i-1]) / 2 * Math.PI / 180))
            } else if (method.value == 'radius_curv_method') {
                if (inci[i] == inci[i-1]) {
                    ni.push(ni[i-1] + (di[i] - di[i-1]) * (Math.sin(azii[i] * Math.PI / 180) - Math.sin(azii[i-1] * Math.PI / 180)) / (azii[i] - azii[i-1]) * (180 / Math.PI)**2)
                    ei.push(ei[i-1] + (di[i] - di[i-1]) * (Math.cos(azii[i] * Math.PI / 180) - Math.cos(azii[i-1] * Math.PI / 180)) / (azii[i] - azii[i-1]) * (180 / Math.PI)**2)
                } else if (azii[i] == azii[i-1]) {
                    ni.push(ni[i-1] + (di[i] - di[i-1]) * (Math.cos(inci[i-1] * Math.PI / 180) - Math.cos(inci[i] * Math.PI / 180)) / (inci[i] - inci[i-1]) * (180 / Math.PI)**2)
                    ei.push(ei[i-1] + (di[i] - di[i-1]) * (Math.cos(inci[i] * Math.PI / 180) - Math.cos(inci[i-1] * Math.PI / 180)) / (inci[i] - inci[i-1]) * (180 / Math.PI)**2)
                } else {
                    ni.push(ni[i-1] + (di[i] - di[i-1]) * (Math.cos(inci[i-1] * Math.PI / 180) - Math.cos(inci[i] * Math.PI / 180)) * (Math.sin(azii[i] * Math.PI / 180) - Math.sin(azii[i-1] * Math.PI / 180)) / (azii[i] - azii[i-1]) / (inci[i] - inci[i-1]) * (180 / Math.PI)**2)
                    ei.push(ei[i-1] + (di[i] - di[i-1]) * (Math.cos(inci[i] * Math.PI / 180) - Math.cos(inci[i-1] * Math.PI / 180)) * (Math.cos(azii[i] * Math.PI / 180) - Math.cos(azii[i-1] * Math.PI / 180)) / (azii[i] - azii[i-1]) / (inci[i] - inci[i-1]) * (180 / Math.PI)**2)
                }
            } else if (method.value == 'balanced_tang_method') {
                if (inci[i] == 0 && inci[i-1] == 0) {
                    ni.push(0)
                    ei.push(0)
                } else {
                    ni.push(ni[i-1] + (di[i] - di[i-1]) / 2 * (Math.sin(inci[i-1] * Math.PI / 180) * Math.cos(azii[i-1] * Math.PI / 180) + Math.sin(inci[i] * Math.PI / 180) * Math.cos(azii[i] * Math.PI / 180)))
                    ei.push(ei[i-1] + (di[i] - di[i-1]) / 2 * (Math.sin(inci[i-1] * Math.PI / 180) * Math.sin(azii[i-1] * Math.PI / 180) + Math.sin(inci[i] * Math.PI / 180) * Math.sin(azii[i] * Math.PI / 180)))
                }
            } else {
                if (inci[i] == 0 && inci[i-1] == 0) {
                    ni.push(0)
                    ei.push(0)
                } else {
                    ni.push(ni[i-1] + (di[i] - di[i-1]) / 2 * (Math.sin(inci[i-1] * Math.PI / 180) * Math.cos(azii[i-1] * Math.PI / 180) + Math.sin(inci[i] * Math.PI / 180) * Math.cos(azii[i] * Math.PI / 180)) * RF(inci[i-1], inci[i], azii[i-1], azii[i]))
                    ei.push(ei[i-1] + (di[i] - di[i-1]) / 2 * (Math.sin(inci[i-1] * Math.PI / 180) * Math.sin(azii[i-1] * Math.PI / 180) + Math.sin(inci[i] * Math.PI / 180) * Math.sin(azii[i] * Math.PI / 180)) * RF(inci[i-1], inci[i], azii[i-1], azii[i]))
                }
            }
        }
    }
    return [ni, ei]
}


let angle_avg = (d1,d2,i1,i2,a1,a2) => {
    let dNorth = (d2 - d1) * Math.sin((i1 + i2) * Math.PI / 180 / 2) * Math.cos((a1 + a2) * Math.PI / 180 / 2)
    let dEast = (d2 - d1) * Math.sin((i1 + i2) * Math.PI / 180 / 2) * Math.sin((a1 + a2) * Math.PI / 180 / 2)
    let dTVD = (d2-d1) * Math.cos((i1 + i2) * Math.PI / 180 / 2)

    return (dNorth, dEast, dTVD)
}



</script>

<template>
<div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">

                <!-- Select Method -->
                <p class="fs-6 fw-medium">Select Survey Method</p>
                <div class="d-flex">
                    <div class="col1">
                        <div class="form-check">
                            <input @click="selectMethodOne" class="form-check-input" type="radio" name="inputMethod" id="method-1" value="angle_avg" v-model="method" checked>
                            <label class="form-check-label" for="method-1">Angle Averaging</label>
                        </div>

                        <div class="form-check">
                            <input @click="selectMethodTwo" class="form-check-input" type="radio" name="inputMethod" id="method-2" value="radius_curv_method" v-model="method">
                            <label class="form-check-label" for="method-2">Radius of Curvature</label>
                        </div>
                    </div>
                    
                    <div class="col2 ms-5">
                        <div class="form-check">
                            <input @click="selectMethodTwo" class="form-check-input" type="radio" name="inputMethod" id="method-3" value="balanced_tang_method" v-model="method">
                            <label class="form-check-label" for="method-3">Balanced Tangential</label>
                        </div>

                        <div class="form-check">
                            <input @click="selectMethodTwo" class="form-check-input" type="radio" name="inputMethod" id="method-4" value="Minimum Curvature" v-model="method">
                            <label class="form-check-label" for="method-4">Minimum Curvature</label>
                        </div>
                    </div>
                </div>
                
                <!-- Survey Table -->
                <table class="survey table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" class="fw-medium text-center">S.No</th>
                            <th scope="col" class="fw-medium text-center">Depth</th>
                            <th scope="col" class="fw-medium text-center">Inclination</th>
                            <th scope="col" class="fw-medium text-center">Azimuth</th>
                            <th scope="col" class="fw-medium text-center">TVD</th>
                            <th scope="col" class="fw-medium text-center">N / E</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr v-for="(item, index) in surveyTable" :key="index">
                            <td class="text-center">{{ index+1 }}</td>
                            <td v-if="index==0"><input class="form-control form-control-sm text-center" type="number" min="0" disabled v-model="item.depth"></td>
                            <td v-else><input class="form-control form-control-sm text-center" type="number" min="0" v-model="item.depth"></td>
                            <td v-if="index==0"><input class="form-control form-control-sm text-center" type="number" min="0" disabled v-model="item.inc"></td>
                            <td v-else><input class="form-control form-control-sm text-center" type="number" min="0" v-model="item.inc"></td>
                            <td v-if="index==0"><input class="form-control form-control-sm text-center" type="number" disabled v-model="item.azi"></td>
                            <td v-else><input class="form-control form-control-sm text-center" type="number" v-model="item.azi"></td>
                            <td class="text-center">{{ item.depth == '' ? 0 : tvdCalc()[index].toFixed(0) }}</td>
                            <td>{{ item.depth == '' ? 0 + ' / ' + 0 : neCalc()[0][index].toFixed(0) + ' / ' + neCalc()[1][index].toFixed(0) }}</td>
                            <button class="btn btn-success btn-sm ms-4" type="button" @click="addSurvey(index)"><i class="fa-solid fa-plus fa-sm add-btn"></i></button>
                            <button class="btn btn-danger btn-sm ms-4" type="button" :class="{disabled: surveyTable.length==2, disabled: index==0 }" @click="deleteSurvey(index)"><i class="fa-solid fa-trash del-btn"></i></button>
                        </tr>
                    </tbody>
                </table>
                
                
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Survey Table Input */
.survey tbody tr td input {
    width: 100px;
}

.add-btn {
    color: #009888;
}

.del-btn {
    color: #a90007;
}

button:hover .add-btn {
    color: white;
}

button:hover .del-btn {
    color: white;
}

</style>