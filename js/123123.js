function defineStatus(data) {
    let rabbit_statuses = {}
        if (data.current_type == "B") {
            if (Object.keys(data.status).length > 1) {
                for (let i = 0; i < Object.keys(data.status).length; i++) {
                    if (data.status[i] == "NJ") {
                        rabbit_statuses[i] += {
                            "status": "Нужна отсадка"
                        }
                    } else if (data.status[i] == "MF") {
                        rabbit_statuses[i] += {
                            "status": "Кормится у матери"
                        }
                    }
                }
                rabbit_status = rabbit_statuses[0].status + ", " + rabbit_statuses[1].status
            } else {
                if (data.status == "NJ") {
                    rabbit_status = "Нужна отсадка"
                } else if (data.status == "MF") {
                    rabbit_status = "Кормится у матери"
                }
            }
        } else if (data.current_type == "F") {
            if (Object.keys(data.status).length > 1) {
                for (let i = 0; i < Object.keys(data.status).length; i++) {
                    if (data.status[i] == "NV") {
                        rabbit_statuses[i] += {
                            "status": "Нужна вакцинация"
                        }
                    } else if (data.status[i] == "NI") {
                        rabbit_statuses[i] += {
                            "status": "Нужен осмотр перед убоем"
                        }
                    } else if (data.status[i] == "WC") {
                        rabbit_statuses[i] += {
                            "status": "Кормится без кокцидиост."
                        }
                    } else if (data.status[i] == "RS") {
                        rabbit_statuses[i] += {
                            "status": "Готов к убою"
                        }
                    }
                    if (Object.keys(rabbit_statuses).length - i == 1) {
                        rabbit_status += rabbit_statuses[i].status
                    } else {
                        rabbit_status += rabbit_statuses[i].status + ", "
                    }
                }
            } else {
                if (data.status == "NV") {
                    rabbit_status = "Нужна вакцинация"
                } else if (data.status == "NI") {
                    rabbit_status = "Нужен осмотр перед убоем"
                } else if (data.status == "WC") {
                    rabbit_status = "Кормится без кокцидиост."
                } else if (data.status == "RS") {
                    rabbit_status = "Готов к убою"
                }
            }
        } else if (data.current_type == "M") {
            if (Object.keys(data.status).length > 1) {
                for (let i = 0; i < Object.keys(data.status).length; i++) {
                    if (data.status[i] == "RF") {
                        rabbit_statuses[i] += {
                            "status": "Готова к размнож."
                        }
                    } else if (data.status[i] == "UP") {
                        rabbit_statuses[i] += {
                            "status": "Неподтвержденная берем."
                        }
                    } else if (data.status[i] == "NI") {
                        rabbit_statuses[i] += {
                            "status": "Нужен осмотр на берем."
                        }
                    } else if (data.status[i] == "CP") {
                        rabbit_statuses[i] += {
                            "status": "Подтвержденная берем."
                        }
                    } else if (data.status[i] == "FB") {
                        rabbit_statuses[i] += {
                            "status": "Кормит крольчат"
                        }
                    }
                    if (Object.keys(rabbit_statuses).length - i == 1) {
                        rabbit_status += rabbit_statuses[i].status
                    } else {
                        rabbit_status += rabbit_statuses[i].status + ", "
                    }
                }
            } else {
                if (data.status == "RF") {
                    rabbit_status = "Готова к размнож."
                } else if (data.status == "UP") {
                    rabbit_status = "Неподтвержденная берем."
                } else if (data.status == "NI") {
                    rabbit_status = "Нужен осмотр на берем."
                } else if (data.status == "CP") {
                    rabbit_status = "Подтвержденная берем."
                } else if (data.status == "FB") {
                    rabbit_status = "Кормит крольчат"
                }
            }
        } else if (data.current_type == "P") {
            if (Object.keys(data.status).length > 1) {
                for (let i = 0; i < Object.keys(data.status).length; i++) {
                    if (data.status[i] == "RF") {
                        rabbit_statuses[i] += {
                            "status": "Готов к размнож."
                        }
                    } else if (data.status[i] == "R") {
                        rabbit_statuses[i] += {
                            "status": "Отдыхает"
                        }
                    }
                }
                rabbit_status = rabbit_statuses[0].status + ", " + rabbit_statuses[1].status
            } else {
                if (data.status == "RF") {
                    rabbit_status = "Готов к размнож."
                } else if (data.status == "R") {
                    rabbit_status = "Отдыхает"
                }
            }
        }
    
    return rabbit_status;
}