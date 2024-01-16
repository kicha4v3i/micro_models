import { ref, reactive } from 'vue'
import { supabase } from '../lib/supabaseClient.js'

let { data: well_information, error } = await supabase.from('well_information').select('id')

// Current Logged In user id
const userData = reactive({
    userId: ''
})

// Applied Drilling Formulas Tabs
const adfTab = reactive({
    activeTab: null
})

// Directional Drilling Formulas Tab
const ddTab = reactive({
    activeTab: null
})

// Drilling Fluid Formulas Tab
const dfTab = reactive({
    activeTav: null
})

// Hydraulics Formulas Tabs
const hydTab = reactive({
    activeTab: null
})

// Well Control Formulas Tabs
const wcTab = reactive({
    activeTab: null
})

// Main Input States
const mainInputs = reactive({
    bitSize: '',
    mw: '',
    flowrate: '',
    pipeOD: '',
    pipeID: '',
    pipeLength: '',

    // Unit Conversion
    bitSizeConv(unit) {
        if (unit == 'inch') {
            this.bitSize = (this.bitSize / 1000 * 3.281 * 12).toFixed(3)
        } else {
            this.bitSize = (this.bitSize * 1000 / 3.281 / 12).toFixed(3)
        }
    },

    mwConv(unit) {
        if (unit == 'ppg') {
            this.mw = (this.mw * 8.33).toFixed(2)
        } else {
            this.mw = (this.mw / 8.33).toFixed(2)
        }
    },

    flowrateConv(unit) {
        if (unit == 'gpm') {
            this.flowrate = (this.flowrate / 3.7854).toFixed(0)
        } else {
            this.flowrate = (this.flowrate * 3.7854).toFixed(0)
        }
     },

     pipeODConv(unit) {
        if (unit == 'inch') {
            this.pipeOD = (this.pipeOD / 1000 * 3.281 * 12).toFixed(3)
        } else {
            this.pipeOD = (this.pipeOD * 1000 / 3.281 / 12).toFixed(3)
        }
     },

     pipeIDConv(unit) {
        if (unit == 'inch') {
            this.pipeID = (this.pipeID / 1000 * 3.281 * 12).toFixed(3)
        } else {
            this.pipeID = (this.pipeID * 1000 / 3.281 / 12).toFixed(3)
        }
     },

     pipeLengthConv(unit) {
        if (unit == 'ft') {
            this.pipeLength = (this.pipeLength * 3.281).toFixed(0)
        } else {
            this.pipeLength = (this.pipeLength / 3.281).toFixed(0)
        }
     }
})

// Main Input Units

const inputUnits = reactive({
    mwUnit: 'ppg',
    bitSizeUnit: 'inch',
    flowrateUnit: 'gpm',
    pipeODUnit: 'inch',
    pipeIDUnit: 'inch',
    pipeLengthUnit: 'ft'
})


// User Login State
const methods = {
    setUser(payload) {
        state.user = payload ? payload.user : null
    },
}

const state = reactive({
    user: null,
})


export default {
    userData, 
    state,
    methods,
    adfTab,
    ddTab,
    dfTab, 
    hydTab,
    wcTab,
    mainInputs,
    inputUnits
}