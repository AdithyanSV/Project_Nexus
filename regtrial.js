document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var registerNo = document.getElementById('register_no').value;
    fetch('regtrial.php?register_no=' + registerNo)
        .then(response => response.json())
        .then(data => {
            var resultDiv = document.getElementById('result');
            if (data.error) {
                resultDiv.innerHTML = '<p>' + data.error + '</p>';
            } else {
                var resultHTML = '<table><tr><th>Register No</th><th>Subject 1</th><th>Subject 2</th><th>Subject 3</th><th>Subject 4</th><th>Subject 5</th><th>Subject 6</th><th>Subject 7</th></tr>';
                resultHTML += '<tr><td>' + data.register_no + '</td><td>' + data.subject1 + '</td><td>' + data.subject2 + '</td><td>' + data.subject3 + '</td><td>' + data.subject4 + '</td><td>' + data.subject5 + '</td><td>' + data.subject6 + '</td><td>' + data.subject7 + '</td></tr></table>';
                resultDiv.innerHTML = resultHTML;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('result').innerHTML = '<p>Error fetching data</p>';
        });
});
