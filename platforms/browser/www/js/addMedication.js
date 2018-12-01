var data, addData, parsedInfo;
var medicationInfo = { "data": [] };

function afterRPFS() {
    requestTFS();
}

function afterRTFS() {
    PFS.getFile("medicationInfo", { create: false }, fileExists, fileDoesNotExist);
}

function fileExists(fileEntry) {
    loadFile("medicationInfo", PFS);
}

function fileDoesNotExist() {}

function SBtrigger() {
    var sb = document.getElementById("Sidebar");
    if (sb.style.width == '150px') {
        document.getElementById("Sidebar").style.width = "0";
        //document.getElementById("main").style.marginLeft= "0";
    } else {
        document.getElementById("Sidebar").style.width = "150px";
        //document.getElementById("main").style.marginLeft = "150px";
    }
}

function loadFileSuccess(filename, content) { //called when load file success
    data = content;
    loadSession(loadSessionSuccess);
}

function loadSessionSuccess(content) {
    var decrypted = CryptoJS.AES.decrypt(data, content);
    content = null;
    medicationInfo = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    console.log(medicationInfo);
}

function validate() {
    var medicine = document.getElementById("medicine").value;
    var dosage = document.getElementById("dosage").value;
    var frequency = document.getElementById("frequency").value;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    var note = document.getElementById("note").value;
    if (!validateStictInput(medicine)) {
        alert("Medicine included invalid characters");
        return;
    } else if (!validateInput(dosage)) {
        alert("Dosage included invalid characters");
        return;
    } else if (!validateInput(frequency)) {
        alert("Frequency included invalid characters");
        return;
    } else if (!validateDate(startDate)) {
        alert("Start Date included invalid characters");
        return;
    } else if (!validateDate(endDate)) {
        alert("End Date included invalid characters");
        return;
    } else if (!validateInput(note)) {
        alert("Note included invalid characters");
        return;
    } else {
        complie(medicine, dosage, frequency, startDate, endDate, note);
    }
}

function complie(medicine, dosage, frequency, startDate, endDate, note) {
    addData = { "medicine": medicine, "dosage": dosage, "frequency": frequency, "startDate": startDate, "endDate": endDate, "note": note};
    medicationInfo['data'].push(addData);
    addData=null;
    console.log(medicationInfo);
    parsedInfo = JSON.stringify(medicationInfo);
    console.log(parsedInfo);
    medicationInfo = null;
    loadSession(encrypt);
}

function encrypt(content) {
    var encryptedData = CryptoJS.AES.encrypt(parsedInfo, content);
    content = null;
    savePersistentFile("medicationInfo", encryptedData);
    encryptedData, parsedInfo = null;
}

function savePersistentFileSuccess(filename) {
    location.replace("home.html");
}