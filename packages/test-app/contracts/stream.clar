;; hello world

(define-public (say-hi)
  (ok "hello world")
)

(define-public (echo-number (val int))
  (ok val)
)

;; streams

(define-map streams
  ((id uint))
  (
    (start-block uint)
    (recipient principal)
    (sender principal)
  )
)

(define-data-var next-stream-id uint u1)

(define-public (make-stream
    (recipient principal)
  )
  (begin
    (map-set streams 
      ((id (var-get next-stream-id)))
      (
        ;; (start-block (unwrap-panic (get-block-info? time block-height)))
        (start-block block-height)
        (recipient recipient)
        (sender tx-sender)
      )
    )
    (var-set next-stream-id (+ (var-get next-stream-id) u1))
    (ok 'true)
    ;; (var-set)
  )
)

(define-public (get-stream
    (stream-id uint)
  )
  (
    ok
    (unwrap-panic
      (map-get? streams (tuple (id stream-id)))
    )
  )
)

;; statuses

(define-map statuses
  (
    (author principal)
  )
  (
    (status (buff 512))
  )
)

(define-public (write-status!
    (status (buff 512))
  )
  (begin
    (map-set statuses
      ((author tx-sender))
      ((status status))
    )
    (ok 'true)
  )
)

;; (define-map squares 
;;    ((x int)) 
;;    ((square int))
;; )

;;;;; Data
;; (define-map namespaces
;;   ((namespace (buff 19)))
;;   ((namespace-import principal)
;;    (revealed-at uint)
;;    (launched-at (optional uint))
;;    (namespace-version uint)
;;    (renewal-rule uint)
;;    ;; (price-function (tuple 
;;    ;;  (buckets (list 16 uint)) 
;;    ;;  (base uint) 
;;    ;;  (coeff uint) 
;;    ;;  (nonalpha-discount uint) 
;;    ;;  (no-vowel-discount uint)))
;;    ))

;; asdf

