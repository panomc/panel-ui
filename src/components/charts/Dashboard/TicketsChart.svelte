<script>
  import Chart from "chart.js";
  import { onMount } from "svelte";

  onMount(() => {
    const ctx2 = document.getElementById("ticketsChart");
    const ticketsChart = new Chart(ctx2, {
      type: "line",
      data: {
        labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
        datasets: [
          {
            data: [8, 5, 9, 7, 12, 8, 9],
            backgroundColor: "rgba(252, 110, 81, .08)",
            borderColor: "#fc6e51",
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

<canvas height="90" id="ticketsChart"></canvas>
