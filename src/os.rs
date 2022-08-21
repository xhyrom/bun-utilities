//use network_interface::{Addr, NetworkInterfaceConfig};
use systemstat::{saturating_sub_bytes, Platform};

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
        Err(_) => None,
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
        Err(_) => None,
    }
}

#[napi]
pub fn uptime() -> Option<f64> {
    match systemstat::System::new().uptime() {
        Ok(time) => Some(time.as_secs_f64()),
        Err(_) => None,
    }
}

/*#[napi(object)]
pub struct CpuInfo {
    pub model: String,
    pub speed: i64,
    pub usage: f64,
    pub vendor_id: String,
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
            vendor_id: cpu.vendor_id().to_string()
        })
    }

    all_cpus
}*/

// Memory functions implementation

#[napi]
pub fn total_memory() -> Option<i64> {
    match systemstat::System::new().memory() {
        Ok(mem) => Some(mem.total.as_u64() as i64),
        Err(_) => None,
    }
}

#[napi]
pub fn free_memory() -> Option<i64> {
    match systemstat::System::new().memory() {
        Ok(mem) => Some(saturating_sub_bytes(mem.total, mem.free).as_u64() as i64),
        Err(_) => None,
    }
}

#[napi]
pub fn total_swap() -> Option<i64> {
    match systemstat::System::new().swap() {
        Ok(swap) => Some(swap.total.as_u64() as i64),
        Err(_) => None,
    }
}

#[napi]
pub fn free_swap() -> Option<i64> {
    match systemstat::System::new().swap() {
        Ok(swap) => Some(saturating_sub_bytes(swap.total, swap.free).as_u64() as i64),
        Err(_) => None,
    }
}

// in progress, waiting for https://github.com/EstebanBorai/network-interface/issues/13
/*#[napi(object)]
pub struct NetworkInfo {
    pub name: String,
    pub address: String,
    pub netmask: Option<String>,
    #[napi(
        ts_type = "'IPv4' | 'IPv6'"
    )]
    pub family: String,
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
pub unsafe fn network_interfaces() -> Vec<NetworkInfo> {
    let all_network_interfaces = network_interface::NetworkInterface::show().unwrap();
    let ifaces = all_network_interfaces.iter().filter_map(|net| {
        if let Some(net_addr) = net.addr {
            let address: String = match net_addr {
                Addr::V4(ip_addr) => ip_addr.ip.to_string(),
                Addr::V6(ip_addr) => ip_addr.ip.to_string(),
            };

            let netmask: String = match net_addr {
                Addr::V4(ip_addr) => ip_addr.netmask.unwrap_unchecked().to_string(),
                Addr::V6(ip_addr) => ip_addr.netmask.unwrap_unchecked().to_string(),
            };

            let family: String = match net_addr {
                Addr::V4(..) => "IPv4".to_string(),
                Addr::V6(..) => "IPv6".to_string(),
            };

            return Some(NetworkInfo {
                name: net.name.clone(),
                address,
                netmask: Some(netmask),
                family,
            });
        }

        None
    }).collect::<Vec<NetworkInfo>>();

    ifaces
}*/
