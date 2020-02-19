<!DOCTYPE html>
<html lang="tr">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Foursquare App</title>
	<link rel="stylesheet" href="<?php echo base_url("assets/third_party/css/bootstrap.css") ?>">  
	<link rel="stylesheet" href="<?php echo base_url("assets/frontend/css/main_page.css") ?>">
	<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
</head>
<body>
	<!-- Navbar -->
	<nav class="navbar navbar-expand-md bg-primary sticky-top">
			<a class="navbar-brand mb-2" href="<?php echo base_url(); ?>"> 
				<img src="<?php echo base_url("assets/frontend/icons/logo.png") ?>">
			</a> 
			<div class="form-inline"> 
				<input 
					class="form-control mb-2 mr-xl-2" 
					id="search-venue-field" 
					type="search" 
					placeholder="Mekan ara.." 
					aria-label="Search"
					@keyup="handleVenueKeyup">
				<div class="input-group">
					<input 
						class="form-control mb-2" 
						type="search" 
						id="location-field" 
						placeholder="Konum" 
						aria-label="Search" 
						value="İstanbul"
						list="city-list"
						@change="locationFieldChange"
						@focus="locationFieldFocus"> 

						<button 
							class="btn btn-light ml-2" 
							style="height: 40px;" 
							title="Güncel konumu kullan"
							@click="handleCurrentLocationSelection">
							<i class="fa fa-location-arrow"></i>
						</button> 
					<datalist id="city-list">
						<?php 
							foreach($cities as $city){
								echo "<option data-value='$city->latitude, $city->longitude' >$city->name</option>";
							}
						?>
					</datalist>
				</div>
			</div>
	</nav>

	<!-- Arama Sonuçlarının yazıldığı container  -->
	<section class="container-fluid" id="result-field" v-if="items">
		<div class="row border-dark border-bottom p-3"  v-for="(venue, index) in items">  
			<div class="col-12 ">
				<h4 class="text-primary">{{index +1 }}. {{venue.name}}</h4>
				<span class="text-secondary" v-if="venue.categories[0]" >{{venue.categories[0].name}}</span>
				<span v-if="venue.location.distance"> - {{(venue.location.distance/1000).toFixed(2)}} km</span>
				<br>
				<span class="text-secondary">
					<span v-if="venue.location.address">{{venue.location.address}} /</span>
					<span v-if="venue.location.city">{{venue.location.city}} /</span>
					<span v-if="venue.location.country">{{venue.location.country}} </span>
				</span>
			</div>
		</div>
	</section>
</body>
<script src="<?php echo base_url("assets/third_party/js/vue.js"); ?>"></script>
<script src="<?php echo base_url("assets/third_party/js/jquery.js"); ?>"></script>
<script src="<?php echo base_url("assets/third_party/js/jquery.debounce.js"); ?>"></script>
<script src="<?php echo base_url("assets/frontend/js/main_page.js") ?>"></script>
</html>