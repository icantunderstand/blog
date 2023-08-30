function mergeTwoList(l1, l2) {
    if(!l1) {
        return l2
    }
    if(!l2) {
        return l1
    }
    if(l1.val > l2.val) {
        l2.next = mergeTwoList(l1, l2.next)
        return l2
    } else {
         l1.next = mergeTwoList(l1.next, l2)
        return l1
    }
}