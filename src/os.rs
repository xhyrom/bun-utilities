use systemstat::{Platform, saturating_sub_bytes};

#[napi]
pub fn homedir() -> Option<String> {
    match dirs::home_dir() {
        Some(path) => Some(path.display().to_string()),
        None => None,
    }
}

#[napi]
pub fn cachedir() -> Option<String> {
    match dirs::cache_dir() {
        Some(path) => Some(path.display().to_string()),
        None => None,
    }
}

#[napi]
pub fn tempdir() -> String {
    std::env::temp_dir().display().to_string()
}

#[napi]
pub fn hostname() -> Option<String> {
    match hostname::get() {
        Ok(name) => Some(name.to_str().unwrap().to_string()),
        Err(..) => None,
    }
}

#[napi]
pub fn platform() -> String {
    std::env::consts::OS.to_string()
}

#[napi]
pub fn arch() -> String {
    std::env::consts::ARCH.to_string()
}

#[napi]
pub fn release() -> Option<String> {
    match sys_info::os_release() {
        Ok(name) => Some(name),
        Err(..) => None,
    }
}

#[napi]
pub fn uptime() -> Option<f64> {
    let sys = systemstat::System::new();

    match sys.uptime() {
        Ok(time) => Some(time.as_secs_f64()),
        Err(..) => None
    }
}

/*#[napi(object)]
pub struct CpuInfo {
    pub model: String,
    pub speed: i64,
    pub usage: f64,
    pub ventor_id: String,
}

#[napi]
pub fn cpus() -> Vec<CpuInfo> {
    let mut all_cpus = Vec::new();
    let sys = sysinfo::System::new_with_specifics(
        sysinfo::RefreshKind::new().with_cpu(sysinfo::CpuRefreshKind::everything()),
    );
    
    for cpu in sys.cpus() {
        all_cpus.push(CpuInfo {
            model: cpu.brand().to_string(),
            speed: cpu.frequency() as i64,
            usage: f64::from(cpu.cpu_usage()),
            ventor_id: cpu.vendor_id().to_string()
        })
    }

    all_cpus
}*/

// Memory functions implementation

#[napi]
pub fn total_memory() -> Option<i64> {
    let sys = systemstat::System::new();

    match sys.memory() {
        Ok(mem) => Some(mem.total.as_u64() as i64),
        Err(..) => None,
    }
}

#[napi]
pub fn free_memory() -> Option<i64> {
    let sys = systemstat::System::new();

    match sys.memory() {
        Ok(mem) => Some(saturating_sub_bytes(mem.total, mem.free).as_u64() as i64),
        Err(..) => None,
    }
}

#[napi]
pub fn total_swap() -> Option<i64> {
    let sys = systemstat::System::new();

    match sys.swap() {
        Ok(swap) => Some(swap.total.as_u64() as i64),
        Err(..) => None,
    }
}

#[napi]
pub fn free_swap() -> Option<i64> {
    let sys = systemstat::System::new();

    match sys.swap() {
        Ok(swap) => Some(saturating_sub_bytes(swap.total, swap.free).as_u64() as i64),
        Err(..) => None,
    }
}

// in progress, waiting for https://github.com/EstebanBorai/network-interface/issues/13
/*#[napi(object)]
pub struct NetworkInfo {
    pub name: String,
    pub address: String,
    /*pub interface_name: String,
    pub received: BigInt,
    pub total_received: BigInt,
    pub transmitted: BigInt,
    pub total_transmitted: BigInt,
    pub packets_received: BigInt,
    pub total_packets_received: BigInt,
    pub packets_transmitted: BigInt,
    pub total_packets_transmitted: BigInt,
    pub errors_on_received: BigInt,
    pub total_errors_on_received: BigInt,
    pub errors_on_transmitted: BigInt,
    pub total_errors_on_transmitted: BigInt,*/
}

#[napi]
pub fn network_interfaces() -> Vec<NetworkInfo> {
    let mut all_network_interfaces = Vec::new();


    /*let mut all_network_interfaces = Vec::new();
    let sys = sysinfo::System::new_with_specifics(
        sysinfo::RefreshKind::new().with_networks_list(),
    );

    for (name, data) in sys.networks() {
        all_network_interfaces.push(NetworkInfo {
            interface_name: name.to_string(),
            received: BigInt::from(data.received()),
            total_received: BigInt::from(data.total_received()),
            transmitted: BigInt::from(data.transmitted()),
            total_transmitted: BigInt::from(data.total_transmitted()),
            packets_received: BigInt::from(data.packets_received()),
            total_packets_received: BigInt::from(data.total_packets_received()),
            packets_transmitted: BigInt::from(data.packets_transmitted()),
            total_packets_transmitted: BigInt::from(data.total_packets_transmitted()),
            errors_on_received: BigInt::from(data.errors_on_received()),
            total_errors_on_received: BigInt::from(data.total_errors_on_received()),
            errors_on_transmitted: BigInt::from(data.errors_on_transmitted()),
            total_errors_on_transmitted: BigInt::from(data.total_errors_on_transmitted()),
        })
    }

    all_network_interfaces*/
}*/