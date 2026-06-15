const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImU1MzE4YTU2LWQ3MzUtNDhmMi05MmNiLTc4YTE0NWFlZGUzNSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2t2c3N3a3RqZWJndmp2Ynlyam9iLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwM2IyZjA4MS1hNjA1LTQ4NDQtODMwYy03NjYzMmE4ZTQ5YWUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzgxNTUxMTUwLCJpYXQiOjE3ODE1NDc1NTAsImVtYWlsIjoiYWRtaW5AZmxvY28ua3oiLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc4MTU0NzU1MH1dLCJzZXNzaW9uX2lkIjoiZGUzNDZkMTMtNGFiZC00OTU0LTlmNDYtOGU0NDlmOGI4ZTRlIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.YIaIdLM2cI6cVnfSqA6d2piTmn636eFRABrj5Jj2ruWyeCr1MsPqXkQMdy6y1lR4W-ScguNX0bJ6BOULaNdstA';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2c3N3a3RqZWJndmp2Ynlyam9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDg2NTIsImV4cCI6MjA5NzA4NDY1Mn0.mML7w5gmqzG0NQCpotHNJSDHUL2GZfjbTq4qAm5ZQYs';

async function testUpdate() {
  const row = {
    name: "Нежный розовый Test",
  };
  
  const res = await fetch('https://kvsswktjebgvjvbyrjob.supabase.co/rest/v1/products?id=eq.1', {
    method: 'PATCH',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(row)
  });
  
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', data);
}
testUpdate();
