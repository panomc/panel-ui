<script>
  import Chart from "chart.js";
  import { onMount } from "svelte";

  onMount(() => {
    const ctx3 = document.getElementById("trafficChart");
    const trafficChart = new Chart(ctx3, {
      type: "pie",
      data: {
        labels: ["Kayıtlı", "Yabancı"],
        datasets: [
          {
            data: [8, 19],
            backgroundColor: ["#1976d2", "rgba(25, 118, 210, .05)"],
            pointRadius: 0,
          },
        ],
      },
      options: {
        legend: {
          display: true,
        },
      },
    });
  });
</script>

<canvas height="200" id="trafficChart"></canvas>
