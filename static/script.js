let mediaRecorder;
let recordedChunks = [];

document.getElementById("startBtn").addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();
    recordedChunks = [];

    mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append("audio_data", blob);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        const link = document.createElement('a');
        link.href = `/download/${data.filename}`;
        link.innerText = "⬇️ Download Recording";
        link.className = "btn btn-success";
        document.getElementById("downloadSection").innerHTML = "";
        document.getElementById("downloadSection").appendChild(link);
    };

    document.getElementById("startBtn").disabled = true;
    document.getElementById("stopBtn").disabled = false;
});

document.getElementById("stopBtn").addEventListener("click", () => {
    mediaRecorder.stop();
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
});
