FNR>2 {
    domain = $4
    hours = $3
    gsub(/[[:space:]]+/, "", domain)
    total += hours;
    domains[domain] += hours;
}

END {
    print "Total:", total, "Stunden";
    for (domain in domains) {
        printf "%s: %d Stunden\n", domain, domains[domain]
    }
}
