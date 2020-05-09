<script>
  import Chart from "chart.js";
  import { onMount } from "svelte";

  onMount(() => {
    const ctx3 = document.getElementById("postsChart");
    const postsChart = new Chart(ctx3, {
      type: "line",
      data: {
        labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
        datasets: [
          {
            data: [8, 5, 9, 7, 12, 8, 9],
            backgroundColor: "rgba(246, 187, 66, .08)",
            borderColor: "#F6BB42",
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

<canvas height="90" id="postsChart"></canvas>
