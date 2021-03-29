<canvas height="90" id="playersChart"></canvas>

<script>
  import Chart from "chart.js";
  import { onMount } from "svelte";

  onMount(() => {
    const ctx1 = document.getElementById("playersChart");
    const playersChart = new Chart(ctx1, {
      type: "line",
      data: {
        labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
        datasets: [
          {
            data: [8, 5, 9, 7, 12, 8, 9],
            backgroundColor: "transparent",
            borderColor: "#1976d2",
            borderWidth: 2.5,
            pointRadius: 0,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
              },
              display: false,
            },
          ],
          xAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          display: false,
        },
      },
    });
  });
</script>
