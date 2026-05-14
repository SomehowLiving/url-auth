function generateHash() {

    const text = document.getElementById("inputText").value;
    const algorithm = document.getElementById("algorithm").value;

    let hash = "";

    if (algorithm === "MD5") {
        hash = CryptoJS.MD5(text).toString();
    }

    else if (algorithm === "SHA1") {
        hash = CryptoJS.SHA1(text).toString();
    }

    else if (algorithm === "SHA256") {
        hash = CryptoJS.SHA256(text).toString();
    }

    document.getElementById("output").innerText = hash;
}

function copyHash() {

    const hashText = document.getElementById("output").innerText;

    navigator.clipboard.writeText(hashText);

    const icon = document.querySelector(".copy-icon");

    icon.innerText = "✅";

    setTimeout(() => {
        icon.innerText = "📋";
    }, 1500);
}