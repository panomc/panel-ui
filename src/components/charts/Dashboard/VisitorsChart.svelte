<script>
  import Chart from "chart.js";
  import { onMount } from "svelte";

  onMount(() => {
    const ctx = document.getElementById("visitorsChart");
    const visitorsChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
        datasets: [
          {
            data: [39, 45, 83, 53, 89, 72, 99],
            borderColor: "#1976d2",
            backgroundColor: "rgba(25, 118, 210, .1)",
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: "#aab2bd",
                beginAtZero: true,
                maxTicksLimit: 10,
                padding: 20,
              },
              gridLines: {
                drawTicks: false,
                display: true,
              },
              display: true,
            },
          ],
          xAxes: [
            {
              ticks: {
                fontColor: "#aab2bd",
                beginAtZero: true,
                maxTicksLimit: 10,
                padding: 20,
              },
              gridLines: {
                drawTicks: false,
                display: false,
              },
              display: true,
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

<canvas height="120" id="visitorsChart"></canvas>
