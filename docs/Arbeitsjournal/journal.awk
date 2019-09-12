FNR>2 {
    domain = $4
    hours = $3
    gsub(/[[:space:]]+/, "", domain)
    total += hours;
    domains[domain] += hours;
}

END {
    printf "Total: %.1f Stunden\n", total
    for (domain in domains) {
        printf "%s: %.1f Stunden\n", domain, domains[domain]
    }
}
